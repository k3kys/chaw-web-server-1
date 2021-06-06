import { BadRequestError } from "../errors"
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

        await user.followings.unshift({ user: req.params.userToFollowId })
        await user.save()

        await userToFollow.followers.unshift({ user: req.currentUser!.id })
        await userToFollow.save()

        res.status(StatusCodes.OK).json({ data: { user, userToFollow } })
    }
)

export const unfollowUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const user = await Follower.findOne({ user: req.currentUser!.id })
        const userToUnfollow = await Follower.findOne({ user: req.params.userToUnfollowId })

        if (!user || !userToUnfollow) {
            throw new BadRequestError("User not found")
        }

        const isFollowing =
            user.followings != null && user.followings.length > 0 &&
            user.followings.filter(following => following.user.toString() === req.params.userToUnfollowId).length === 0

        if (isFollowing) {
            throw new BadRequestError("User Not Followed before")
        }

        const removeFollowing = await user.followings
            .map(following => following.user.toString())
            .indexOf(req.params.userToUnfollowId)

        const removeFollower = await userToUnfollow.followers
            .map(follower => follower.user.toString())
            .indexOf(req.currentUser!.id)


        await user.followings.splice(removeFollowing, 1)
        await user.save()

        await userToUnfollow.followers.splice(removeFollower, 1)
        await userToUnfollow.save()

        res.status(StatusCodes.OK).json({ data: { user, userToUnfollow } })
    }
)

export const getFollower = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await Follower.findOne({ user: req.params.userId }).populate("followers.user")

        res.status(StatusCodes.OK).send(user)
    }
)