import mongoose from "mongoose"
import { ProfileDoc } from "./profile"

interface PostModel extends mongoose.Model<PostDoc> { }

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

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema)

export { Post }