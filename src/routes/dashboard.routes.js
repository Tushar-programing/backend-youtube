import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()

router.route("/getChannelStats").post(verifyJWT, getChannelStats)

router.route("/getChannelVideos").post(verifyJWT, getChannelVideos)

export default router