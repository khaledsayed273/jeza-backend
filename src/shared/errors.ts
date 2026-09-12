export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export function BadRequestError(message = "Bad request"): HttpError {
  return new HttpError(400, message);
}

export function UnauthorizedError(message = "Unauthorized"): HttpError {
  return new HttpError(401, message);
}

export function ForbiddenError(message = "Forbidden"): HttpError {
  return new HttpError(403, message);
}

export function NotFoundError(message = "Not found"): HttpError {
  return new HttpError(404, message);
}
