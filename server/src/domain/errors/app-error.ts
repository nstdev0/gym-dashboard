import { BaseError } from "./base-error";

export class AppError extends BaseError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode, true);
  }
}
