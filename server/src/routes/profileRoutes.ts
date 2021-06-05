import { currentUser, requireAuth } from "../middlewares"
import express from "express"
import * as profileController from "../controllers/profileController"
const router = express.Router()

router.route("/createProfile/:userId").post(profileController.createProfile)

router.route("/updateProfile/:profileId").patch(profileController.updateProfile)

router.route("/deleteProfile/:profileId").delete(profileController.deleteProfile)

router.route("/getProfile/:profileId").get(profileController.getProfile)

export default router;
