
import {Socket, Server as SocketServer} from "socket.io";
import {Server as HttpServer} from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export interface SocketWithUserId extends Socket {
  userId?: string;
}
// Map to store online users in 
export const onlineUsers:Map<string,string>=new Map(); //userId -> socketId


export const initializeSocket = (httpServer: HttpServer) => {

  const allowedOrigins = [
"http://localhost:8081", // Expo mobile
"http://localhost:5173", // Vite web dev
process.env.FRONTEND_URL as string, // production
];
  const io = new SocketServer(httpServer, {cors:{origin:allowedOrigins}});


  // verify socket connection - if the user is authenticated, we will store the user id in the socket object

  io.use(async (socket: SocketWithUserId, next) => {

    const token = socket.handshake.auth.token; //this is sent from the client side
    if(!token){
      return next(new Error("Authentication token missing"));
    }

    // verify the token using Clerk
    try {
      const clerkUser = await verifyToken(token,{secretKey: process.env.CLERK_SECRET_KEY as string});

      const clerkUserId = clerkUser.sub;
      const user=await User.findOne({clerkId: clerkUserId});
      if(!user){
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
     
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  })

 

  // this "connection" event name is special and should be written like this
  // it's the event that is triggered when a new client connects to the server


  io.on("connection", (socket: SocketWithUserId) => {
    const userId = socket.userId;
   
    //send list of online user Ids to the newly connected user
    socket.emit("online-users",{userIds: Array.from(onlineUsers.keys())});

    // Add user to online users map
    if(userId){
      onlineUsers.set(userId, socket.id);
    }

    // Notify other users that this user is online
    socket.broadcast.emit("user-online", {userId});

    socket.join(`user:${userId}`); // Join a room specific to the user



    socket.on("join-chat",(chatId: string)=>{   // Join a room specific to the chat
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat",(chatId: string)=>{  // Leave the room specific to the chat
      socket.leave(`chat:${chatId}`);
    });

    //Handling Incoming Messages

    socket.on("new-message", async (data: {chatId: string; text: any}) => {
      const {chatId, text} = data;

      try {
        // Verify that the user is a participant of the chat
        const chat=await Chat.findOne({_id: chatId,participants: userId});
        if(!chat){
          socket.emit("error", {message: "Chat not found or you are not a participant"});
          return;
        }

        // Create and save the new message
        const message=await Message.create({
          chat: chatId,
          sender: userId,
          text
        });

        // Update the chat's last message and last message timestamp

        chat.lastMessage=message._id;
        chat.lastMessageAt=new Date();

        await chat.save(); // Save the updated chat

        await message.populate('sender','name email avatar'); //populate sender details

        // Emit the message to all participants in the chat
        io.to(`chat:${chatId}`).emit("new-message", message);

        io.to(`user:${userId}`).emit("chat-updated", chat); //notify sender about chat update

        // Notify other participant(s) about chat update
        chat.participants.forEach(participantId => {

          const participantIdStr=participantId.toString();
          if(participantIdStr !== userId){
            io.to(`user:${participantIdStr}`).emit("chat-updated", chat);
          }
        });

      } catch (error) {
        socket.emit("socket-error", {message: "Failed to send message"});
      }
    }
    );

    //typing indicator
    socket.on("typing", (data: {chatId: string; isTyping: boolean}) => {})

    // Handle disconnection event // Special event name "disconnect"
    socket.on("disconnect", () => {
      // Remove user from online users map
      if(userId){
        onlineUsers.delete(userId);
      }
      // Notify other users that this user is offline
      socket.broadcast.emit("user-offline", {userId});
    });
 })

 return io;
}

 // As soon as the user is online it will get the list of all online users and notify other users that this user is online