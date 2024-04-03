import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {User}  from '../models/user.model.js'
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const status = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            channel: 0,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribed",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            subscriber: 0,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likes",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        video: 0,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            videolikes: {
                                $size: "$likes"
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                // totalViews: {
                //     $sum: "$videos.views"
                // },
                videolike: {
                    $sum: "$videos.videolikes" // Calculate the sum of videolikes across all videos
                },
                totalVideos: {
                    $size: "$videos"
                },
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribedCount: {
                    $size: "$subscribed"
                }
            }
        },
        {
            $project: {
                _id: 0, // Exclude _id field
                email: 0,
                password: 0,
                refreshToken: 0,
                // subscribers: 0,
            }
        }
    ])

    if (!status) {
        throw new ApiError(400, "No user found with this id")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, status, "user fetched successfully"))
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const totalVideos = await Video.find({owner: req.user._id});

    if(!totalVideos) {
        throw new ApiError(500, "No videos available")
    };

    res
    .status(200)
    .json(new ApiResponse(200, totalVideos, "Success"))
})

export {
    getChannelStats, 
    getChannelVideos
}