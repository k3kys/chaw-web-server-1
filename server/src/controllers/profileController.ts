import { BadRequestError } from "../errors";
import { Request, Response, NextFunction } from "express"
import { Profile } from "../models/profile"
import { User,UserDoc } from "../models/user"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../middlewares"
import { Follower } from "../models/follower"

export interface profileFields {
    user: UserDoc,
    image: string,
    motherCountry: string,
    motherLanguage: string,
    learningLanguage: string,
    intro: string,
    social: {
        facebook?: string | undefined,
        instagram?: string | undefined
    },
    university: string
}

export const createProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { userId } = req.params

        const user = await User.findOne({ _id: userId })

        if (!user) {
            throw new BadRequestError("User is not existing")
        }

        const university = user.university

        const { image, motherCountry, motherLanguage,
            learningLanguage, intro, facebook, instagram } = req.body

        let profileFields = {} as profileFields;

        profileFields.user = user
        profileFields.image = image
        profileFields.motherCountry = motherCountry
        profileFields.motherLanguage = motherLanguage
        profileFields.learningLanguage = learningLanguage
        profileFields.intro = intro
        profileFields.university = university

        if (facebook && instagram) {
            profileFields.social = { facebook: facebook, instagram: instagram }
        } else if (facebook) {
            profileFields.social = { facebook: facebook }
        } else {
            profileFields.social = { instagram: instagram }
        }

        const existingProfile = await Profile.findOne({ user })

        if (existingProfile) {
            throw new BadRequestError("Profile is already existing")
        }

        const profile = await new Profile(profileFields)

        profile.save()

        const follower = await new Follower({ user, followers: [], following: [] })

        follower.save()

        res.status(StatusCodes.OK).send(profile);
    }
)

export const updateProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { profileId } = req.params

        const profile = await Profile.findOne({ _id: profileId })

        if (!profile) {
            throw new BadRequestError("Profile is not existing")
        }

        const { image, motherCountry, motherLanguage,
            learningLanguage, intro, facebook, instagram } = req.body

        let profileFields = {} as profileFields;

        profileFields.image = image
        profileFields.motherCountry = motherCountry
        profileFields.motherLanguage = motherLanguage
        profileFields.learningLanguage = learningLanguage
        profileFields.intro = intro

        if (facebook && instagram) {
            profileFields.social = { facebook: facebook, instagram: instagram }
        } else if (facebook) {
            profileFields.social = { facebook: facebook }
        } else {
            profileFields.social = { instagram: instagram }
        }

        //@ts-ignore
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: profileId },
            { $set: profileFields },
            { new: true }
        )

        profile.save()

        res.status(StatusCodes.OK).send(updatedProfile);
    }
)

export const getProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { profileId } = req.params

        const profile = await Profile.findOne({ _id: profileId })

        if (!profile) {
            throw new BadRequestError("Profile is not existing")
        }

        res.status(StatusCodes.OK).send(profile);
    }
)

export const deleteProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { profileId } = req.params

        const profile = await Profile.findOne({ _id: profileId })

        if(profile) {
            await profile.remove();
        } else {
            throw new BadRequestError("Profile is not existing")
        }

        res.status(StatusCodes.OK).send({});
    }
)