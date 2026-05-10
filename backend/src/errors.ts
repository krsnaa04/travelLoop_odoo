export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFound = (entity: string) => new AppError(`${entity} not found`, 404);
export const forbidden = (message = 'Forbidden') => new AppError(message, 403);
