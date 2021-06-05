import { BadRequestError } from "../errors";
import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../middlewares"
import { Follower } from "../models/follower"

export const followUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const user = await Follower.findOne({ user: req.currentUser!.id })
        const userToFollow = await Follower.findOne({ user: req.params.userToFollowId })

        if (!user || !userToFollow) {
            throw new BadRequestError("User not found")
        }

        const isFollowing =
            user.followings != null && user.followings.length > 0 &&
            user.followings.filter(following => following.user.toString() === req.params.userToFollowId).length > 0

        if (isFollowing) {
            throw new BadRequestError("User Already Followed")
        }

        //@ts-ignore
        await Follower.findOneAndUpdate(
            { user: req.currentUser!.id },
            { $push: { "followers": [{ user: req.params.userToFollowId }]}},
            { new: true }
        )
        user.save()

        //@ts-ignore
        await Follower.findOneAndUpdate(
            { user: req.params.userToFollowId },
            { $push: { "followings": [{ user: req.currentUser!.id }]}},
            { new: true }
        )
        userToFollow.save()

        res.status(StatusCodes.OK).send({})
    }
)