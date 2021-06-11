import { BadRequestError, NotFoundError } from "../errors";
import { Request, Response, NextFunction } from "express"

import { Profile } from "../models/profile"
import { User } from "../models/user"
import { Post } from "../models/post"
import { Hit } from "../models/hit"

import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../middlewares"

export const createPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const user = await User.findOne({ _id: req.currentUser!.id })
        const profile = await Profile.findOne({ user: req.currentUser!.id })

        if (!user || !profile) {
            throw new NotFoundError()
        }

        const existingPost = await Post.findOne({ user: req.currentUser?.id })

        if (existingPost) {
            throw new BadRequestError("Post is already existing")
        }

        const post = await new Post({
            user, profile
        })

        post.save()

        res.status(StatusCodes.OK).send(post)
    }
)

export const getPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress

        const existingHit = await Hit.findOne({
            post: req.params.postId, ip
        })

        if (!existingHit) {
            const hit = await new Hit({
                post: req.params.postId, ip
            })

            hit.save()

            await Post.findOneAndUpdate(
                { _id: req.params.postId },
                {
                    $inc: {
                        "viewCount": 1
                    }
                },
                { new: true }
            )
        }

        const post = await Post.findOne({ _id: req.params.postId })
            .populate("user")
            .populate("profile")

        if (!post) {
            throw new NotFoundError()
        }

        post.save()

        res.status(StatusCodes.OK).send(post)
    }
)

export const getAllPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const order = req.query.order || ''

        const searchKeyword = req.query.searchKeyword
            ? {
                name: {
                    $regex: req.query.searchKeyword,
                    $options: "i",
                },
            }
            : {}

        const motherLanguage = req.query.motherLanguage
            ? {
                motherLanguage: {
                    $regex: req.query.motherLanguage,
                    $options: "i",
                },
            }
            : {}

        const learningLanguage = req.query.learningLanguage
            ? {
                learningLanguage: {
                    $regex: req.query.learningLanguage,
                    $options: "i",
                },
            }
            : {}

        //@ts-ignore
        const user = await User.findOne({ ...searchKeyword })
        //@ts-ignore
        const userMotherLanguage = await Profile.findOne({ ...motherLanguage })
        //@ts-ignore
        const userLearningLanguage = await Profile.findOne({ ...learningLanguage })

        if (!user || !userMotherLanguage || !userLearningLanguage) {
            throw new NotFoundError()
        }

        const sortOrder =
            order === "최신순"
                ? { _id: -1 }
                : order === "좋아요순"
                    ? { likes: -1 }
                    : order === "조회순"
                        ? { viewCount: -1 }
                        : { _id: -1 }

        const post = await Post.find({
            $and: [
                {
                    $or: [
                        {},
                        { user: user._id },
                        { profile: userMotherLanguage._id },
                        { profile: userLearningLanguage._id }]
                },
            ]
        })
            .populate("user")
            .populate("profile")
            .sort(sortOrder)

        if (!post) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(post)
    }
)

export const deletePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const post = await Post.findOne({ _id: req.params.postId })

        if (!post) {
            throw new NotFoundError()
        }

        const user = await User.findOne({ _id: req.currentUser!.id })

        const hit = await Hit.findOne({
            post: req.params.postId
        })

        await hit?.remove()

        if (post.user.toString() !== req.currentUser!.id) {
            if (user?.isAdmin) {
                await post.remove()
            } else {
                throw new BadRequestError("Not Admin")
            }
        }

        await post.remove()

        res.status(StatusCodes.OK).send({})
    }
)

export const likePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const post = await Post.findById(req.params.postId)

        if (!post) {
            throw new NotFoundError()
        }

        const isLiked =
            post.likes.filter(like => like.user.toString() === req.currentUser!.id).length > 0;

        if (isLiked) {
            throw new BadRequestError("Post already liked")
        }

        await post.likes.unshift({ user: req.currentUser!.id });
        await post.save();

        res.status(StatusCodes.OK).send({ post })
    }
)

export const unlikePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const post = await Post.findById(req.params.postId)

        if (!post) {
            throw new NotFoundError()
        }

        const isLiked =
            post.likes.filter(like => like.user.toString() === req.currentUser!.id).length === 0

        if (isLiked) {
            throw new BadRequestError("Post not liked before")
        }

        const index = post.likes.map(like => like.user.toString()).indexOf(req.currentUser!.id);

        await post.likes.splice(index, 1);
        await post.save();

        res.status(StatusCodes.OK).send({ post })
    }
)