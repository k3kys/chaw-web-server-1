import { Request, Response, NextFunction } from "express"
import { BadRequestError, NotAuthorizedError, NotFoundError } from "../errors"

import { User } from "../models/user"
import { Gmailer } from "../services"

import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

const generateRandom = function (min: number, max: number) {
    const ranNum = Math.floor(Math.random() * (max - min + 1)) + min

    return ranNum
}

const generateToken = (id?: string, email?: string, isAdmin?: boolean, university?: string): string => {
    return jwt.sign(
        { id, email, isAdmin, university },
        process.env.JWT_KEY!,
        {
            expiresIn: process.env.JWT_EXPIRES_IN!,
        }
    )
}

export const signup =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { name, email, password, confirmPassword, university } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            throw new BadRequestError("Email in use")
        }

        if (password !== confirmPassword) {
            throw new BadRequestError("Please confirm your password")
        }

        const user = User.build({ name, email, password, confirmPassword, university })

        await user.save()

        const userJwt = generateToken(user.id, user.email, user.isAdmin, user.university)

        req.session = {
            jwt: userJwt,
        }

        res.status(StatusCodes.OK).send(user)
    }


export const signin =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { email, password } = req.body

        const existingUser = await User.findOne({ email }).select('+password')

        if (!existingUser) {
            throw new BadRequestError("Invalid credentials")
        }

        const passwordsMatch = await User.correctPassword(password, existingUser.password!)

        if (!passwordsMatch) {
            throw new BadRequestError("Password is not matched")
        }

        const userJwt = generateToken(existingUser.id, existingUser.email, existingUser.isAdmin, existingUser.university)

        req.session = {
            jwt: userJwt,
        }

        res.status(StatusCodes.OK).send(existingUser)
    }

export const signout =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        req.session = null

        res.send({})
    }

export const currentUser =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.send({ currentUser: req.currentUser || null })
    }


export const forgotPassword =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            throw new NotFoundError()
        }

        const resetToken = generateToken(user.email)

        user.passwordResetToken = resetToken

        await user.save({ validateBeforeSave: false })

        const resetURL = `http://localhost:3000/resetPassword/`
        const message = `<a href=${resetURL}>???????????? ????????????</a>`

        const gmail = new Gmailer()

        await gmail.sendMessage({
            email: user.email,
            subject: "Chaw: ???????????? ????????? ????????????????",
            message
        })

        res.status(StatusCodes.OK).json({ resetToken: resetToken })
    }


export const resetPassword =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findOne({ passwordResetToken: req.params.resetToken })

        if (!user) {
            throw new BadRequestError("Token is invalid or has expired")
        }

        user.password = req.body.password
        user.confirmPassword = req.body.confirmPassword
        user.passwordResetToken = undefined

        await user.save()

        const userJwt = generateToken(user.id, user.email, user.isAdmin, user.university)

        req.session = {
            jwt: userJwt,
        }

        res.status(StatusCodes.OK).json({
            token: userJwt,
        })
    }


export const sendEmail =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const number = generateRandom(111111, 999999)

        const { email } = req.body

        if (!email) {
            throw new BadRequestError("Please input your mail")
        }

        const message = "????????? ?????? 6????????? ?????????????????? : " + number

        const gmail = new Gmailer()

        gmail.sendMessage({
            email: email,
            subject: "Chaw: ????????? ????????? ????????????.",
            message
        })

        res.status(StatusCodes.OK).json({
            data: { number, email }
        })
    }

export const updatePassword =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { passwordCurrent, password, confirmPassword } = req.body

        const user = await User.findById(req.currentUser?.id).select('+password')

        const passwordsMatch = await User.correctPassword(passwordCurrent, user!.password)

        if (!passwordsMatch) {
            throw new NotAuthorizedError()
        }

        user!.password = password
        user!.confirmPassword = confirmPassword

        await user!.save()

        const userJwt = generateToken(user!.id, user!.email, user!.isAdmin, user!.university)

        req.session = {
            jwt: userJwt,
        }

        res.status(StatusCodes.OK).send(user)
    }