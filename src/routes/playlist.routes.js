import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route("/createPlaylist").post(verifyJWT, createPlaylist)

router.route("/getUserPlaylists/:userId").post(verifyJWT, getUserPlaylists)

router.route("/getPlaylistById/:playlistId").post(verifyJWT, getPlaylistById)

router.route("/addVideo/:videoId/:playlistId").post(verifyJWT, addVideoToPlaylist)

router.route("/removeVideo/:videoId/:playlistId").post(verifyJWT, removeVideoFromPlaylist)

router.route("/deletePlaylist/:playlistId").post(verifyJWT, deletePlaylist)

router.route("/updatePlaylist/:playlistId").post(verifyJWT, updatePlaylist)

export default router