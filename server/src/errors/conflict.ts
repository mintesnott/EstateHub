import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class ConflictError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT; // 409
  }
}

export default ConflictError;