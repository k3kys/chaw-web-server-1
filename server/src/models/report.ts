import mongoose from "mongoose"
import { UserDoc } from "../models/user"
import { PostDoc } from "../models/post"

interface ReportModel extends mongoose.Model<ReportDoc> { }

export interface ReportDoc extends mongoose.Document {
    user: string | UserDoc,
    post: string | PostDoc
}

const reportSchema = new mongoose.Schema<ReportDoc>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

}, {
    timestamps: true
})

const Report = mongoose.model<ReportDoc, ReportModel>("Report", reportSchema)

export { Report }