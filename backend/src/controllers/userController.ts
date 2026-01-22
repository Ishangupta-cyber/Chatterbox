import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";

export async function getUsers(req:AuthRequest, res:Response,next:NextFunction) {

  try {

    // Since the route is protected, req.userId should be available
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Fetch all users except the requesting user
    const users=await User.find({_id:{$ne:userId}}).select("name email avatar")
    .limit(50); // Limit to 50 users for performance
    return res.status(200).json({ users });
    
  } catch (error) {
    res.status(500)
    next(error);
  }

}