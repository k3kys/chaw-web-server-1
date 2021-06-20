import { BadRequestError, NotFoundError } from "../errors"
import { Request, Response, NextFunction } from "express"

import { Report } from "../models/report"
import { User } from "../models/user"
import { Post } from "../models/post"

import { StatusCodes } from "http-status-codes"

export const createReport =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findOne({ _id: req.currentUser?.id })
        const post = await Post.findOne({ _id: req.params.postId })

        if (!user || !post) {
            throw new NotFoundError()
        }

        const existingReport = await Report.findOne({ user, post })

        if (existingReport) {
            throw new BadRequestError("Report is already existing")
        }

        const report = await Report.create({
            user, post
        })

        res.status(StatusCodes.OK).send(report)
    }

export const getReport =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const report = await Report.findOne({ _id: req.params.reportId })
            .populate("user")
            .populate("post")

        if (!report) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(report)
    }

export const getAllReport =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const report = await Report.find({})
            .populate("user")
            .populate("post")

        if (!report) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(report)
    }