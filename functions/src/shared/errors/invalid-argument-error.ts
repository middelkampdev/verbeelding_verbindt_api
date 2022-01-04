
import {HttpsError} from "firebase-functions/v1/https";

interface InvalidArgumentErrorPrameters {
  message: string;
}

export class InvalidArgumentError extends HttpsError {
  constructor({
    message,
  }: InvalidArgumentErrorPrameters) {
    super(
        "invalid-argument",
        message,
    );
  }
}
