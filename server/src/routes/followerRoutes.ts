import { currentUser, requireAuth } from "../middlewares"
import express from "express"
import * as followerController from "../controllers/followerController"
const router = express.Router()

router.route("/followUser/:userToFollowId").post(currentUser, requireAuth, followerController.followUser)

export default router;
