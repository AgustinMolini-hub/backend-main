export class AppError extends Error {
    constructor(errorCode, details = null) {
        super(errorCode);

        this.name = 'AppError';
        this.errorCode = errorCode;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}
