import multer from 'multer';

import { AppError } from '../errors/app.error.js';
import { ERROR_DICTIONARY } from '../errors/error.dictionary.js';
import logger from '../config/logger.js';



export const errorMiddleware = (
    err,
    req,
    res,
    next
) => {


    logger.error(
        `ERROR CAPTURADO: ${err.message}`,
        {
            name: err.name,
            stack: err.stack,
            errorCode: err.errorCode
        }
    );



    let errorCode;



    if (err instanceof AppError) {


        errorCode = err.errorCode;


    }



    else if (err instanceof multer.MulterError) {


        switch (err.code) {


            case 'LIMIT_FILE_SIZE':

                errorCode = 'FILE_TOO_LARGE';
                break;


            case 'LIMIT_UNEXPECTED_FILE':

                errorCode = 'INVALID_FILE_FIELD';
                break;


            default:

                errorCode = 'FILE_SAVE_ERROR';
                break;

        }


    }



    else if (err.message === 'INVALID_FILE_TYPE') {


        errorCode = 'INVALID_FILE_TYPE';


    }



    else if (err.message === 'INVALID_UPLOAD_TYPE') {


        errorCode = 'INVALID_UPLOAD_TYPE';


    }



    else {


        errorCode = 'INTERNAL_SERVER_ERROR';


    }




    const errorDefinition =
        ERROR_DICTIONARY[errorCode];





    if (errorDefinition) {


        return res
            .status(errorDefinition.statusCode)
            .json({

                status:'error',

                error:{

                    code:errorCode,

                    message:errorDefinition.message,

                    details:err.details ?? null

                }

            });


    }




    return res
        .status(500)
        .json({

            status:'error',

            error:{

                code:'INTERNAL_SERVER_ERROR',

                message:
                    'Ocurrió un error interno del servidor.',

                details:null

            }

        });


};