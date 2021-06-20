import mongoose from "mongoose"

export interface ProfileAttrs {
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

interface ProfileModel extends mongoose.Model<ProfileDoc> {
    build(attrs: ProfileAttrs): ProfileDoc,
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

profileSchema.statics.build = (attrs: ProfileAttrs) => {
    return new Profile(attrs)
}

const Profile = mongoose.model<ProfileDoc, ProfileModel>("Profile", profileSchema)

export { Profile }