import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";


const router = Router()

router.route("/toggleVideoLike/:videoId").post(verifyJWT, toggleVideoLike)

router.route("/toggleCommentLike/:commentId").post(verifyJWT, toggleCommentLike)

router.route("/toggleTweetLike/:tweetId").post(verifyJWT, toggleTweetLike)

router.route("/getLikedVideos").post(verifyJWT, getLikedVideos)

export default router