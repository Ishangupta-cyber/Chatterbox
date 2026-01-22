

import {Router} from "express"
import { protectRoute } from "../middleware/auth"
import { createChatWithParticipant, getAllChats } from "../controllers/chatController"

const router = Router()

router.use(protectRoute)

router.get("/",getAllChats)
router.post("/with/:participantId",createChatWithParticipant)




export default router