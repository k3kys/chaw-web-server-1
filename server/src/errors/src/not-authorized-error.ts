import { CustomError } from './custom-error';
import StatusCodes from "http-status-codes"

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}