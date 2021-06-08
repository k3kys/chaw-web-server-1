import mongoose from "mongoose"

interface ProfileModel extends mongoose.Model<ProfileDoc> {}

export interface ProfileDoc extends mongoose.Document {
    user: string,
    image: string | undefined,
    motherCountry: string,
    motherLanguage: [string],
    learningLanguage: [string],
    intro: string,
    social: {
        facebook?: string | undefined,
        instagram?: string | undefined
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

const Profile = mongoose.model<ProfileDoc, ProfileModel>("Profile", profileSchema)

export { Profile }