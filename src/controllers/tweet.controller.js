import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    if (!content) {
        throw new ApiError(200, "content feild is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id,
    })

    if (!tweet) {
        throw new ApiError(200, "unable to create tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;
    const { page = 1, limit = 10, sortType } = req.query;

    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;
    const sortBy = sortType === 'new' ? 1 : -1;

    if (!userId) {
        throw new ApiError(401, "userid not found")
    }

    const tweet = await Tweet
    .find({owner: userId})
    .sort({createdAt: sortBy})
    .skip(pageSkip)
    .limit(parsedLimit)

    if (!tweet) {
        throw new ApiError(400, "No Tweets Found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "successfully got the tweets"));

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {updateTweet} = req.body
    const {tweetId} = req.params

    if (!updateTweet || !tweetId) {
        throw new ApiError(200, "tweet and tweetid is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: updateTweet,
            }
        },
        {new: true}
    )

    if (!tweet) {
        throw new ApiError(400, "The tweet was not found.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "succesfully updated the tweet"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if (!tweetId) {
        throw new ApiError(400, "tweetid is not found")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if (!tweet) {
        throw new ApiError(400, "This tweet does not exist.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "succesfully deleted tweet"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}