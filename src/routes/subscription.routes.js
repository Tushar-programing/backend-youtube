import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";


const router = Router()

router.route("/subscribe/:channelId").post(verifyJWT, toggleSubscription)

router.route("/subscriber/:channelId").post(verifyJWT, getUserChannelSubscribers)

router.route("/subscribed/:subscriberId").post(verifyJWT, getSubscribedChannels)

export default router