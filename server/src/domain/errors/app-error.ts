import { BaseError } from "./base-error";

export class AppError extends BaseError {
  constructor(code: string, message: string, statusCode = 500) {
    super(code, message, statusCode, true);
  }
}
