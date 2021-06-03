import { validateRequest, currentUser, requireAuth } from "../middlewares";
import express from "express"
import { body } from "express-validator"
import * as authController from "../controllers/authController"

const router = express.Router()

router.route("/signin").post([
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must supply a password")
],
  validateRequest, authController.signin)

router.route("/signup").post([
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 charcters"),
  body("confirmPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("confirmPassword must be between 4 and 20 charcters")
],
  validateRequest, authController.signup)

router.route("/send-email").post(
  [
    body("email")
      .isEmail()
      .contains("ac.kr")
      .withMessage("must ac.kr"),
  ],
  validateRequest, authController.sendEmail)

router.route("/signout").post(authController.signout)

router.route("/currentuser").get(currentUser, authController.currentUser)

router.route('/forgotPassword').post(authController.forgotPassword);

router.route("/resetPassword/:resetToken").patch(authController.resetPassword)

router.route("/updatePassword").patch(currentUser, requireAuth, authController.updatePassword)

export default router;