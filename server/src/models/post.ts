import mongoose from "mongoose"

interface PostModel extends mongoose.Model<PostDoc> { }

export interface PostDoc extends mongoose.Document {
    user: string,
    profile: string,
    viewCount: number
}

const postSchema = new mongoose.Schema<PostDoc>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },

    viewCount: {
        type: Number
    }

}, {
    timestamps: true
})

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema)

export { Post }