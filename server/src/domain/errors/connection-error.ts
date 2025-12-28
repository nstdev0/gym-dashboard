import { BaseError } from "./base-error";

export class ConnectionError extends BaseError {
  constructor(message: string = "Database connection error") {
    super("CONNECTION_ERROR", message, 500, true);
  }
}
