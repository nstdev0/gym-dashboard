import { BaseError } from "./base-error";

export class ConnectionError extends BaseError {
  constructor(message: string = "Database connection error") {
    super(message, 500, "CONNECTION_ERROR");
  }
}
