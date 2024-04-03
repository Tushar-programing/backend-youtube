import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(400, "channel id is not found")
    }

    const exist = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })
    // console.log("exist", exist)

    if (exist) {
        const del = await Subscription.findByIdAndDelete(exist._id)

        if (del) {
            return res
            .status(201)
            .json(new ApiResponse(201, {}, "succesfully delete subscription"))
        }
    }
    
    const subscribed = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId,
    })

    if (!subscribed) {
        throw new ApiError(400, "Failed to subscribe the user.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribed, "user subscribed succesfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // console.log(channelId);
    if (!channelId) {
        throw new ApiError(400, "channel Id not found")
    }

    const getSubscriber = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                owner_details: {
                    $first: "$subscribers"
                }
            }
        },
        {
            $project: {
                subscribers: 0,
            }
        },
        // console.log("text com"),
    ])

    if (!getSubscriber?.length) {
        throw new ApiError(400, "channel subscriber did not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, getSubscriber, "subscriber fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    // console.log(channelId);
    // console.log("1");
    if (!subscriberId) {
        throw new ApiError(400, "subscriberId Id not found")
    }
    // console.log("2");

    const getSubscriber = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                owner_details: {
                    $first: "$subscribers"
                }
            }
        },
        {
            $project: {
                subscribers: 0,
            }
        },
        // console.log("text com"),
    ])
    // console.log("3");


    if (!getSubscriber?.length) {
        throw new ApiError(400, "subscribed channel did not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, getSubscriber, "subscriber fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}