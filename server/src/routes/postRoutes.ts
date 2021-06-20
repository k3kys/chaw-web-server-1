import { currentUser } from "../middlewares"
import express from "express"
import * as postController from "../controllers/postController"
const router = express.Router()

router.route("/createPost").post(currentUser, postController.createPost)

router.route("/getPost/:postId").get(postController.getPost)

router.route("/getAllPostByLike").get(currentUser, postController.getAllPostByLike)

router.route("/getAllPostByView").get(currentUser, postController.getAllPostByView)

router.route("/getAllPostByNew").get(currentUser, postController.getAllPostByNew)

router.route("/deletePost/:postId").delete(currentUser, postController.deletePost)

router.route("/likePost/:postId").post(currentUser, postController.likePost)

router.route("/unlikePost/:postId").post(currentUser, postController.unlikePost)

export default router
