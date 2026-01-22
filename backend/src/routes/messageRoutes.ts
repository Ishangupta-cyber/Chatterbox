import {Router} from "express"
import { getMe } from "../controllers/authController"
import { protectRoute } from "../middleware/auth"
import { getMessages } from "../controllers/messageController"

const router = Router()

// Example route for sending a message

router.get("/chat/:chatId",protectRoute,getMessages)

export default router