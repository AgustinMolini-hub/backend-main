export class AppError extends Error {

    constructor(
        errorCode,
        details = null
    ) {

        super(errorCode);

        this.name = 'AppError';

        this.errorCode = errorCode;

        this.details = details;

        this.isOperational = true;

        Error.captureStackTrace(
            this,
            this.constructor
        );
    }

}