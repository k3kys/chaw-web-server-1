import mongoose from "mongoose"

interface HitModel extends mongoose.Model<HitDoc> { }

export interface HitDoc extends mongoose.Document {
    post: string,
    ip: any
}

const hitSchema = new mongoose.Schema<HitDoc>({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

    ip: {
        type: String
    }

}, {
    timestamps: true
})

const Hit = mongoose.model<HitDoc, HitModel>("Hit", hitSchema)

export { Hit }