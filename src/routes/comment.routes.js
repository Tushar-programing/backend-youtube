import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/addComment/:videoId").post(verifyJWT, addComment);

router.route("/updateComment/:commentId").post(verifyJWT, updateComment);

router.route("/deleteComment/:commentId").post(verifyJWT, deleteComment);

router.route("/getVideoComments/:videoId").post(verifyJWT, getVideoComments)

export default router 