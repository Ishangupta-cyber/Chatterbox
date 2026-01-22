import type { Response,NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {

    try {

        const { chatId } = req.params;
        const userId=req.userId

        // Logic to fetch messages for the given chatId and userId

       const chat=await Chat.find({_id:chatId,participants:userId})
        if(!chat.length){
            res.status(404)
            return next(new Error("Chat not found"))
        }

        // For Messages
        
        const messages=await Message.find({chat:chatId}).populate("sender","name email avatar")
        .sort({createdAt:1})
        res.status(200).json(messages)

    } catch (error) {
      res.status(500)
      next(error)
      
    }


}