import { app } from './app';
import { connectDB } from "./utils"
import dotenv from "dotenv"
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, "../.env") });

const PORT = process.env.PORT!

const start = async () => {
    connectDB()

    app.listen(PORT, () => {
        console.log(`Server started at PORT ${PORT}`);
    });
}

start()