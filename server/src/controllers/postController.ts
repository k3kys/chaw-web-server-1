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

        const post = await Post.create({
            user, profile
        })

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
            await Hit.create({
                post: req.params.postId, ip
            })

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

        res.status(StatusCodes.OK).send(post)
    }
)

export const getAllPostByLike = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const searchKeyword = req.query.searchKeyword || ''
        const motherLanguage = req.query.motherLanguage || ''
        const learningLanguage = req.query.learningLanguage || ''

        const user = await User.findOne({ name: { $regex: searchKeyword as string, $options: 'i' } })
        const userMotherLanguage = await Profile.find({ motherLanguage: motherLanguage as string })
        const userLearningLanguage = await Profile.find({ learningLanguage: learningLanguage as string })

        const userFilter = searchKeyword ? { user } : {}
        const motherLanguageFilter = motherLanguage ? { profile: userMotherLanguage } : {}
        const learningLanguageFilter = learningLanguage ? { profile: userLearningLanguage } : {}

        if (!user || !userMotherLanguage || !userLearningLanguage) {
            throw new NotFoundError()
        }

        const post = await Post.find({
            ...userFilter,
            ...motherLanguageFilter,
            ...learningLanguageFilter
        })
            .populate("user")
            .populate("profile")
            .sort({ likes: -1 })

        if (!post) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(post)
    }
)

export const getAllPostByView = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const searchKeyword = req.query.searchKeyword || ''
        const motherLanguage = req.query.motherLanguage || ''
        const learningLanguage = req.query.learningLanguage || ''

        const user = await User.findOne({ name: { $regex: searchKeyword as string, $options: 'i' } })
        const userMotherLanguage = await Profile.find({ motherLanguage: motherLanguage as string })
        const userLearningLanguage = await Profile.find({ learningLanguage: learningLanguage as string })

        const userFilter = searchKeyword ? { user } : {}
        const motherLanguageFilter = motherLanguage ? { profile: userMotherLanguage } : {}
        const learningLanguageFilter = learningLanguage ? { profile: userLearningLanguage } : {}

        if (!user || !userMotherLanguage || !userLearningLanguage) {
            throw new NotFoundError()
        }

        const post = await Post.find({
            ...userFilter,
            ...motherLanguageFilter,
            ...learningLanguageFilter
        })
            .populate("user")
            .populate("profile")
            .sort({ viewCount: -1 })

        if (!post) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(post)
    }
)

export const getAllPostByNew = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const searchKeyword = req.query.searchKeyword || ''
        const motherLanguage = req.query.motherLanguage || ''
        const learningLanguage = req.query.learningLanguage || ''

        const user = await User.findOne({ name: { $regex: searchKeyword as string, $options: 'i' } })
        const userMotherLanguage = await Profile.find({ motherLanguage: motherLanguage as string })
        const userLearningLanguage = await Profile.find({ learningLanguage: learningLanguage as string })

        const userFilter = searchKeyword ? { user } : {}
        const motherLanguageFilter = motherLanguage ? { profile: userMotherLanguage } : {}
        const learningLanguageFilter = learningLanguage ? { profile: userLearningLanguage } : {}

        const post = await Post.find({
            ...userFilter,
            ...motherLanguageFilter,
            ...learningLanguageFilter
        })
            .populate("user")
            .populate("profile")

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