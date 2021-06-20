import express from "express"
import { currentUser } from "../middlewares"
import * as reportController from "../controllers/reportController"
const router = express.Router()

router.route("/createReport/:postId").post(currentUser, reportController.createReport)

router.route("/getReport/:reportId").get(reportController.getReport)

router.route("/getAllReport/").get(reportController.getAllReport)

export default router
