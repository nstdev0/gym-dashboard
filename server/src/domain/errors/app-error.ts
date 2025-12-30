import { BaseError } from "./base-error";

export class AppError extends BaseError {
  constructor(message: string, statusCode = 400, code = "APP_ERROR") {
    super(message, statusCode, code);
  }
}
