import mongoose from "mongoose"
import { ProfileDoc } from "./profile"
import { UserDoc } from "./user"

export interface PostAttrs {
    user: UserDoc | string
    profile: ProfileDoc | string,
}

export interface PostDoc extends mongoose.Document {
    user: any,
    profile: string | ProfileDoc[],
    likes: [
        {
            user: string | ProfileDoc[]
        }
    ],
    viewCount: number
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(attrs: PostAttrs): PostDoc
}


const postSchema = new mongoose.Schema<PostDoc>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },

    likes: [
        { 
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
        }
    ],

    viewCount: {
        type: Number
    }

}, {
    timestamps: true
})

postSchema.statics.build = (attrs: PostAttrs) => {
    return new Post(attrs)
}

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema)

export { Post }