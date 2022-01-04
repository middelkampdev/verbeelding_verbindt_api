import {HttpsError} from "firebase-functions/v1/https";

interface UnknownInternalServerErrorPrameters {
  message?: string;
}

export class UnknownInternalServerError extends HttpsError {
  constructor({
    message,
  }: UnknownInternalServerErrorPrameters) {
    super(
        "internal",
        // eslint-disable-next-line max-len
        message || "Internal server error. Please try again later.",
    );
  }
}
