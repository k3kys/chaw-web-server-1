import { currentUser } from "../middlewares"
import express from "express"
import * as postController from "../controllers/postController"
const router = express.Router()

router.route("/createPost").post(currentUser, postController.createPost)

router.route("/getPost/:postId").get(postController.getPost)

router.route("/getAllPost").get(currentUser, postController.getAllPost)

router.route("/deletePost/:postId").delete(currentUser, postController.deletePost)

export default router;
