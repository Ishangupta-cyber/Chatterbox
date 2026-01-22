
import type { Response ,NextFunction} from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

export async function getAllChats(req: AuthRequest, res: Response, next: NextFunction) {
  try {

    const userId=req.userId
    
    const chats=await Chat.find({participants:userId})
    .populate("participants","name email avatar")
    .populate("lastMessage")
    .sort({lastMessageAt:-1})


    const formattedChats=chats.map(chat=>{
      const otherParticipants=chat.participants.find(participant=>participant._id.toString()!==userId)
      return {
        _id:chat._id,
        participants:otherParticipants,
        lastMessage:chat.lastMessage,
        lastMessageAt:chat.lastMessageAt,
        createdAt:chat.createdAt,
       
      }
    })

    res.status(200).json(formattedChats)

  } catch (error) {
    res.status(500)
    next(error)
  }
}

export async function createChatWithParticipant(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    
    const userId=req.userId
    const {participantId}=req.params

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants:{$all:[userId,participantId]}
    })
     .populate("participants","name email avatar")
    .populate("lastMessage")

    if(!chat){
      // Create new chat
      const newChat = new Chat({
        participants:[userId,participantId]
      })
      await newChat.save()
      chat=await newChat.populate("participants","name email avatar")
    }

    const otherParticipants=chat.participants.find(participant=>participant._id.toString()!==userId)
    const formattedChat={
      _id:chat._id,
      participants:otherParticipants||null,
      lastMessage:chat.lastMessage,
      lastMessageAt:chat.lastMessageAt,
      createdAt:chat.createdAt,
    }

    res.status(200).json(formattedChat)

  } catch (error) {
    res.status(500)
    next(error)
  }
}