import mongoose from "mongoose"
import { DatabaseConnectionError } from "../../errors/"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('Connected to MongoDB')
    } catch (err) {
        throw new DatabaseConnectionError()
    }
}
