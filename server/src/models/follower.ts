import mongoose from "mongoose"
import { UserDoc } from "./user"

interface FollowerModel extends mongoose.Model<FollowerDoc> { }

export interface FollowerDoc extends mongoose.Document {
    user: UserDoc | string,
    followers: [
        {
            user: UserDoc | string
        }
    ]
    followings: [
        {
            user: UserDoc | string
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

    followings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ]
}, {
    timestamps: true
})

const Follower = mongoose.model<FollowerDoc, FollowerModel>("Follower", followerSchema)

export { Follower }