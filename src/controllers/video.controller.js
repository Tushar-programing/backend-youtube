import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, paginationx

    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit
    const sortStage = sortType === 'asc'? 1 : -1;

    const allVideo = await Video.aggregate([
        {
            $match: {
                isPublished: true,
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerResult",
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
                    $first: "$ownerResult"
                }
            }
        },
        {
            $sort: {sortStage}
        },
        {
            $skip: pageSkip,
        },
        {
            $limit: parsedLimit,
        },
        {
            $project: {
                ownerResult: 0,
            }
        }

    ])

    if (!allVideo) {
        throw new ApiError (404, "video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allVideo, "video fetched succesfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration, views, isPublished } = req.body

    if (
        [title, description, duration, views, isPublished].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "all feilds is required");
    }
    // console.log("text 1")

    const existedUser = await Video.findOne({
        $or: [{ title }]    //  $or means here "Operators" like || && these type and can use use multiple
    })

    // console.log("text 2")

    if (existedUser) {
        throw new ApiError(409, "title is already exists")
    }

    // console.log("text 3")

    // console.log(req.files);

    // console.log("test 3.1");
    const videoLocalPath = req.files?.videoFile[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Avatar file is required normal");
    }
    // console.log("text 5")


    const thumbnailLocalPath = req.files.thumbnailFile[0].path
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "cover image is required")
    }
    // console.log("text 4")


    const vFile = await uploadOnCloudinary(videoLocalPath);
    const thFile = await uploadOnCloudinary(thumbnailLocalPath);
    // console.log("text 6")

    if (!vFile && !thFile) {
        throw new ApiError(400, "vFile and thFile file is required ", vFile, thFile);
    }

    const video = await Video.create({
        videoFile: vFile.url,
        thumbnail: thFile.url,
        title,
        description,
        duration,
        views,
        isPublished,
        owner: req.user?._id,
    })

    // console.log("text 6")


    return res.status(201).json(
        new ApiResponse(200, video, "video upload succesfully succesfully ")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    console.log("1")
    const { videoId } = req.params
    //TODO: get video by id
    console.log("2")
    console.log("videoid", videoId);
    if (!videoId) {
        throw new ApiError(400, "video id is required")
    }
    console.log("3")

    const video = await Video.findById(videoId)
    console.log("4")
    if (!video) {
        throw new ApiError(400, "video not found")
    }
    console.log("5")

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video has generated")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body;

    const thumbnail = req.file?.path
    // const coverImageLocalPath = req.file?.path
    // console.log(videoId, title, description, thumbnail);
    
    if (!title && !description && !thumbnail) {
        throw new ApiError(400, "title or description is required")
    }

    const thumb = await uploadOnCloudinary(thumbnail)

    const update = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || "",
                description: description || "",
                thumbnail: thumb?.url || "",
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, update, "video updated succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    // console.log(videoId);
    if (!videoId) {
        throw new ApiError(400, "invalid video id")
    }
    const remove = await Video.findByIdAndDelete(videoId)

    if (!remove) {
        throw new ApiError(400, "unable to delte video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "video delete succesfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { isPublished } = req.body

    console.log(isPublished, videoId)
    console.log("text 0")

    if (!videoId) {
        throw new new ApiError(400, "videoId is not find")
    }
    console.log("text 1")

    const update = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: isPublished,
            }
        },
        {new: true}
    )
    console.log("text 3")


    return res
    .status(201)
    .json(new ApiResponse(200, update, "toogle update successfull"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}