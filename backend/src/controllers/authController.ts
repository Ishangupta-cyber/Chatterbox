import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";



export async function getMe(req:AuthRequest, res:Response,next:NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user details from the database
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
     res.status(500)
     next(error);
  }
}

export async function authCallback(req:Request, res:Response,next:NextFunction) {
  try {
    const { userId:clerkId } = getAuth(req);

    if(!clerkId){
      return res.status(401).json({message:"Unauthorized"})
    }

    let user=await User.findOne({clerkId});
    if (!user) {
      // If user does not exist, create a new user
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
      if (!primaryEmail) {
        return res.status(400).json({ message: "Email address required" });
      };
      user = await User.create({
        clerkId,
        name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : primaryEmail.split("@")[0],
         
         email: primaryEmail,
        avatar: clerkUser.imageUrl
      })
    }

    return res.status(200).json({ user });
  } catch (error) {

    res.status(500)
    next(error);
    
  }
}

