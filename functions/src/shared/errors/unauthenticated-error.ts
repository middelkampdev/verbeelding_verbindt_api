import {HttpsError} from "firebase-functions/v1/https";

interface UnauthenticatedErrorPrameters {
  message?: string;
}

export class UnauthenticatedError extends HttpsError {
  constructor({
    message,
  }: UnauthenticatedErrorPrameters) {
    super(
        "unauthenticated",
        // eslint-disable-next-line max-len
        message || "Request not authenticated due to missing, invalid, or expired OAuth token.",
    );
  }
}
