import mongoose from "mongoose"
import { UserDoc } from "./user"

interface FollowerModel extends mongoose.Model<FollowerDoc> { }

export interface FollowerDoc extends mongoose.Document {
    user: UserDoc,
    followers: [
        {
            user: UserDoc
        }
    ]
    followings: [
        {
            user: UserDoc
        }
    ]
}

const followerSchema = new mongoose.Schema<FollowerDoc>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    followers: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ],

    following: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ]
}, {
    timestamps: true
})

const Follower = mongoose.model<FollowerDoc, FollowerModel>("Follower", followerSchema)

export { Follower }