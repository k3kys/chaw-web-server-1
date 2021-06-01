import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../errors';
import StatusCodes from "http-status-codes"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(StatusCodes.BAD_REQUEST).send({
    errors: [{ message: 'Something went wrong' }],
  });
};