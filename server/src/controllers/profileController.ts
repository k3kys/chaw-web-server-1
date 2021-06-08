import { BadRequestError, NotFoundError } from "../errors";
import { Request, Response, NextFunction } from "express"
import { Profile } from "../models/profile"
import { User, UserDoc } from "../models/user"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../middlewares"
import { Follower } from "../models/follower"

export const createProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const user = await User.findOne({ _id: req.params.userId })

        if (!user) {
            throw new NotFoundError()
        }

        const existingProfile = await Profile.findOne({ user: user._id })

        if (existingProfile) {
            throw new BadRequestError("Profile is already existing")
        }

        const { image, motherCountry, motherLanguage,
            learningLanguage, intro, facebook, instagram } = req.body

        const profile = new Profile({
            user: user._id,
            image: image,
            motherCountry: motherCountry,
            motherLanguage: motherLanguage,
            learningLanguage: learningLanguage,
            intro: intro,
            social: {
                facebook: facebook,
                instagram: instagram
            },
            university: user.university
        })

        profile.save()

        const follower = await new Follower({ user, followers: [], following: [] })

        follower.save()

        res.status(StatusCodes.OK).send(profile)
    }
)

export const updateProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const profile = await Profile.findOne({ _id: req.params.profileId })

        if (!profile) {
            throw new NotFoundError()
        }

        const { image, motherCountry, motherLanguage,
            learningLanguage, intro, facebook, instagram } = req.body

        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: profile._id },
            {
                $set: {
                    image, motherCountry, motherLanguage,
                    learningLanguage, intro, facebook, instagram
                }
            },
            { new: true }
        )

        profile.save()

        res.status(StatusCodes.OK).send(updatedProfile);
    }
)

export const getProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const profile = await Profile.findOne({ _id: req.params.profileId })

        if (!profile) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(profile);
    }
)

export const deleteProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const profile = await Profile.findOne({ _id: req.params.profileId })

        if(!profile) {
            throw new NotFoundError()
        }

        await profile.remove();

        res.status(StatusCodes.OK).send({});
    }
)