import { NotFoundError } from "../errors";
import { Request, Response, NextFunction } from "express"
import { User } from "../models/user"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../middlewares"

export const searchUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const searchKeyword = req.query.searchKeyword
        ? {
            name: {
                $regex: req.query.searchKeyword,
                $options: "i",
            },
        }
        : {}

        //@ts-ignore
        const user = await User.find({ ...searchKeyword })

        if (!user) {
            throw new NotFoundError()
        }

        res.status(StatusCodes.OK).send(user)
    }
)