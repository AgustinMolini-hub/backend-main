import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';


const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


const uploadsPath =
    path.join(
        __dirname,
        '../../uploads'
    );


const usersPath =
    path.join(
        uploadsPath,
        'users'
    );


const receiptsPath =
    path.join(
        uploadsPath,
        'receipts'
    );


// ==========================
// Creación asíncrona de carpetas
// ==========================

await Promise.all([

    fs.mkdir(
        usersPath,
        {
            recursive: true
        }
    ),

    fs.mkdir(
        receiptsPath,
        {
            recursive: true
        }
    )

]);


// ==========================
// Almacenamiento
// ==========================

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            const uploadType =
                req.uploadType;


            if (
                uploadType ===
                'user-document'
            ) {

                return cb(
                    null,
                    usersPath
                );

            }


            if (
                uploadType ===
                'receipt'
            ) {

                return cb(
                    null,
                    receiptsPath
                );

            }


            return cb(
                new Error(
                    'INVALID_UPLOAD_TYPE'
                )
            );

        },


        filename: (
            req,
            file,
            cb
        ) => {

            const extension =
                path
                    .extname(
                        file.originalname
                    )
                    .toLowerCase();


            const uniqueName =
                `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}${extension}`;


            cb(
                null,
                uniqueName
            );

        }

    });


// ==========================
// Tipos permitidos
// ==========================

const allowedMimeTypes = [

    'application/pdf',

    'image/jpeg',

    'image/png'

];


const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {

        return cb(
            new Error(
                'INVALID_FILE_TYPE'
            )
        );

    }


    cb(
        null,
        true
    );

};


// ==========================
// Configuración Multer
// ==========================

const upload =
    multer({

        storage,

        limits: {

            fileSize:
                5 * 1024 * 1024

        },

        fileFilter

    });


export default upload;