import { catchAsync } from "../middlewares"
import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors"

interface MulterRequest extends Request {
    file: any
}

export const fileUpload = catchAsync(
    async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {

        if(!req.file) {
            throw new BadRequestError("Please file upload")
        }

        res.status(StatusCodes.OK).send(req.file.location);
    }
)