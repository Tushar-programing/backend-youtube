import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()

router.route("/create-tweet").post(verifyJWT, createTweet)

router.route("/get-tweet/:userId").get(verifyJWT, getUserTweets)

router.route("/update-tweet/:tweetId").get(verifyJWT, updateTweet)

router.route("/delete-tweet/:tweetId").get(verifyJWT, deleteTweet)

export default router
