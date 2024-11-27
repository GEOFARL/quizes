export interface HttpErrorDetails {
  status: number;
  statusText: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export class HttpError extends Error {
  public details: HttpErrorDetails;

  constructor(message: string, details: HttpErrorDetails) {
    super(message);
    this.name = "HttpError";
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}
