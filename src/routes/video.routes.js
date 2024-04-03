import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/get-videos").post(verifyJWT, getAllVideos)

router.route("/upload-video").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnailFile",
            maxCount: 1
        }
    ]),
    publishAVideo
)
router.route("/get-video/:videoId").get(verifyJWT, getVideoById)

router.route("/edit-video/:videoId").get(verifyJWT, upload.single("thumbnail"), updateVideo)

router.route("/delete-video/:videoId").get(verifyJWT, deleteVideo)

router.route("/publish-video/:videoId").get(verifyJWT, togglePublishStatus)

export default router