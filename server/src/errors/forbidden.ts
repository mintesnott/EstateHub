import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class ForbiddenError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN; // 403
  }
}

export default ForbiddenError;