import { currentUser, requireAuth } from "../middlewares"
import express from "express"
import * as followerController from "../controllers/followerController"
const router = express.Router()

router.route("/followUser/:userToFollowId").post(currentUser, requireAuth, followerController.followUser)

router.route("/unfollowUser/:userToUnfollowId").patch(currentUser, requireAuth, followerController.unfollowUser)

router.route("/getFollower/:userId").get(followerController.getFollower)

export default router;
