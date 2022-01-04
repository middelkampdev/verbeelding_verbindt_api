import {HttpsError} from "firebase-functions/v1/https";
import errToJSON from "error-to-json";

interface InternalServerErrorPrameters {
  message?: string;
  innerError: Error;
}

export class InternalServerError extends HttpsError {
  constructor({
    message,
    innerError,
  }: InternalServerErrorPrameters) {
    super(
        "internal",
        // eslint-disable-next-line max-len
        message || "Internal server error. Please try again later.",
        errToJSON(innerError),
    );
  }
}
