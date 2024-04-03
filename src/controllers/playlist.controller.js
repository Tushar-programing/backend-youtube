import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    // console.log(name, description)
    // console.log(req.user._id);
    
    if (!name || !description) {
        throw new ApiError(400, "Please provide all fields")
    }

    const existed = await Playlist.findOne({
        $and: [{name}, {owner: req.user._id}]
    })

    if (existed) {
        throw new ApiError(400, "playlist already exist")     
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(400, "unable to create playlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, playlist, "playlist has created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    // console.log(userId);

    if (!userId) {
        throw new ApiError(401, "user id not found")
    }

    const play = await Playlist.find({
        owner: userId
    })

    if (!play) {
        throw new ApiError(400, "No playlist with this UserID exists.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, play,  'Successfully got the playlist.'))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    // console.log(playlistId);

    if (!playlistId) {
        throw new ApiError(400, "playlist not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Invalid playlist ID.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist retrieved successfully."))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    console.log("playlist",playlistId, "videoId", videoId);

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Missing data in request body or params.")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400,  "The playlist does not exist.")
    }
    
    const exists = playlist.videos.includes(videoId);

    // console.log('exist', exists);
    if (exists) {
        throw new ApiError(400, "video alredy exist")
    }

    playlist.videos.push(videoId)

    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "video added succesfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    console.log(playlistId, videoId);
    
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Missing data in request body or params.")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    // playlist.videos = playlist.videos.filter((vi) => vi !== videoId)
    playlist.videos = playlist.videos.filter((vid) => vid != videoId );

    const save = await playlist.save();

    if (!save) {
        throw new ApiError(400, "unable to save")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist,"video delete succesfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!playlistId) {
        throw new ApiError(400, "playlist not found")
    }

    const dele = await Playlist.findByIdAndDelete(playlistId);

    if (!dele) {
        throw new ApiError(400, "unable to delete playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "delete succesfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!playlistId || !name || !description) {
        throw new ApiError(400, "all feilds are required")
    }

    const update = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            }
        },
        {new: true},
    )

    if (!update) {
        throw new ApiError(400, "unable to update")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "playlist update succesfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}