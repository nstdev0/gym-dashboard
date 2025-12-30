import { BaseError } from "./base-error";

export class ValidationError extends BaseError {
  constructor(message: string = "Validation Error") {
    super(message, 400, "VALIDATION_ERROR");
  }
}
