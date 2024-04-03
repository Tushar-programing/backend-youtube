import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if (!videoId) {
        throw new ApiError(400, "videoId is not find")
    }

    const existed = await Like.findOne({
        $and: [{video: videoId}, {likedBy: req.user._id}]
    })

    if (existed) {
        // throw new ApiError(400, "already exist")
        const rem = await Like.findByIdAndDelete(existed._id)

        if (!rem) {
            throw new ApiError(400, "unable to delete like")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "unliked the video"))
    }

    const create = await Like.create({
        video: videoId,
        likedBy: req.user._id,
    })

    if (!create) {
        throw new ApiError(400, "Something went wrong when creating a like.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "liked createdd succesfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!commentId) {
        throw new ApiError(400, "comment id not found")
    }

    const existed = await Like.findOne({
        $and: [{comment: commentId}, {likedBy: req.user._id}]
    })

    if (existed) {
        // const rem = await Like.findByIdAndRemove(existed._id)
        const rem = await Like.findByIdAndDelete(existed._id)

        if (!rem) {
            throw new ApiError(400, "Unable to remove comment like")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "removed likes from comment"))
    }

    const create = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    if (!create) {
        throw new ApiError(400, "unable to like the comment")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, create, "comment was successfully liked."))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if (!tweetId) {
        throw new ApiError(400, "tweetId is required")
    }

    const exist = await Like.findOne({
        $and: [{tweet: tweetId}, {likedBy: req.user._id}]
    })

    if (exist) {
        const rem = await Like.findByIdAndDelete(exist._id)

        if (!rem) {
            throw new ApiError(400, "unable to remove like from tweet")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "liked delete succesfully"))
    }

    const create = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    })

    if (!create) {
        throw new ApiError(400, "unable to create like")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "like created!"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const get = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null  }
    })

    if (!get) {
        throw new ApiError(400, "No Likes Found!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, get, "Likes Retrieved Successfully!"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}