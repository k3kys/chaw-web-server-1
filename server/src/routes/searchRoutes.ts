import express from "express"
import * as searchController from "../controllers/searchController"
const router = express.Router()

router.route("/searchUser").get(searchController.searchUser)

export default router;
