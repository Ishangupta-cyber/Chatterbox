import {Router} from "express"
import { getMe } from "../controllers/authController"
import { protectRoute } from "../middleware/auth"
import { getMessages } from "../controllers/messageController"

const router = Router()

// Get messages for a specific chat

router.get("/chat/:chatId",protectRoute,getMessages)

export default router