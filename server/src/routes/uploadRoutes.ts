import * as uploadController from "./../controllers/uploadController"
import express from "express"
import { uploadS3 } from "../services/src/s3-upload"
const router = express.Router()

router.route("/s3").post(uploadS3.single("image"), uploadController.fileUpload)

export default router;