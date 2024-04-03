import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
// import { ApiError } from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;
    // const sortBy = sortType === 'new' ? 1 : -1;

    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }

    const allComment = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner_details: {
                    $first: "$owner"
                }
            }
        },
        {
            $skip: pageSkip,
        },
        {
            $limit: parsedLimit,
        },
        {
            $project: {
                owner: 0,
            }
        }
    ])

    if (!allComment) {
        throw new ApiError(400, "unable to get all comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allComment, "successfully got the comments"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if (!videoId || !content) {
        throw new ApiError(400, "Missing required fields")
    }

    const create = await Comment.create({
        video: videoId,
        content,
        owner: req.user._id,
    })

    if (!create) {
        throw new ApiError(400, "unable to create comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "comment create succesfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if (!commentId || !content) {
        throw new  ApiError(400, "all feilds are required")
    }

    const update = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError("unable to update")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "comment has updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "comment id not found")
    }

    const del = await Comment.findByIdAndDelete(commentId)

    if (!del) {
        throw new ApiError(400, "Unable to delete the comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment delete succesfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}