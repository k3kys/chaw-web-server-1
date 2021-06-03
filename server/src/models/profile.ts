import mongoose from "mongoose"
import { UserDoc } from "./user"

export interface ProfileAttrs {
    image: string | undefined
    motherCountry: string
    currentCountry: string
    confirmPassword: string,
    motherLanguage: [string],
    learningLanguage: [string],
    intro: string,
    social: {
        facebook: string | undefined,
        instagram: string | undefined
    },
    university: string
}

interface ProfileModel extends mongoose.Model<ProfileDoc> {
    build(attrs: ProfileAttrs): ProfileDoc
}

export interface ProfileDoc extends mongoose.Document {
    user: UserDoc
    image: string | undefined
    motherCountry: string
    currentCountry: string
    confirmPassword: string,
    motherLanguage: [string],
    learningLanguage: [string],
    intro: string,
    social: {
        facebook: string | undefined,
        instagram: string | undefined
    },
    university: string
}

const profileSchema = new mongoose.Schema<ProfileDoc>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    image: {
        type: String
    },
    motherCountry: {
        type: String,
        required: true
    },
    currentCountry: {
        type: String,
        required: true
    },
    motherLanguage: [
        {
            type: String,
            required: true
        }
    ],
    learningLanguage: [
        {
            type: String,
            required: true
        }
    ],
    intro: {
        type: String,
        required: true
    },
    social: {
        facebook: { type: String },
        instagram: { type: String }
    },
    university: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

profileSchema.statics.build = (attrs: ProfileAttrs) => {
    return new Profile(attrs)
}

const Profile = mongoose.model<ProfileDoc, ProfileModel>("Profile", profileSchema)

export { Profile }