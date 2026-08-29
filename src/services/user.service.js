import mongoose from 'mongoose';
import fs from 'fs/promises';

import { UserRepository } from '../repositories/user.repository.js';
import { ROLES } from '../constants/index.js';
import { AppError } from '../errors/app.error.js';
import logger from '../config/logger.js';



export class UserService {


    constructor() {

        this.userRepo = new UserRepository();

    }




    async getAllUsers() {

        return await this.userRepo.getAll();

    }





    async getUserById(id) {


        if (!mongoose.Types.ObjectId.isValid(id)) {

            throw new AppError(
                'INVALID_USER_ID',
                {
                    userId: id
                }
            );

        }



        const user =
            await this.userRepo.getById(id);



        if (!user) {

            throw new AppError(
                'USER_NOT_FOUND',
                {
                    userId: id
                }
            );

        }



        return user;

    }








    async registerUser(data) {


        if (!data.name || !data.email) {

            throw new AppError(
                'INVALID_USER_DATA'
            );

        }




        const existingUser =
            await this.userRepo.getByEmail(
                data.email
            );




        if (existingUser) {

            throw new AppError(
                'USER_ALREADY_EXISTS',
                {
                    email:data.email
                }
            );

        }





        const role =
            Object.values(ROLES).includes(data.role)
                ? data.role
                : ROLES.USER;





        return await this.userRepo.create({

            ...data,

            role

        });


    }









    async uploadDocument(
        id,
        file,
        documentType
    ) {



        if (!mongoose.Types.ObjectId.isValid(id)) {


            await this.removeUploadedFile(file);



            throw new AppError(
                'INVALID_USER_ID',
                {
                    userId:id
                }
            );


        }






        if (!file) {


            throw new AppError(
                'FILE_REQUIRED'
            );


        }







        const user =
            await this.userRepo.getById(id);




        if (!user) {


            await this.removeUploadedFile(file);



            throw new AppError(
                'USER_NOT_FOUND',
                {
                    userId:id
                }
            );


        }








        const allowedDocumentTypes = [

            'DNI',

            'LICENSE',

            'OTHER'

        ];






        if (!allowedDocumentTypes.includes(documentType)) {



            await this.removeUploadedFile(file);



            throw new AppError(
                'INVALID_DOCUMENT_TYPE',
                {
                    documentType
                }
            );


        }







        const documentData = {


            originalName:
                file.originalname,


            filename:
                file.filename,


            path:
                file.path,


            mimetype:
                file.mimetype,


            size:
                file.size,


            documentType,


            uploadedAt:
                new Date()


        };








        try {



            const updatedUser =
                await this.userRepo.addDocument(
                    id,
                    documentData
                );





            if (!updatedUser) {


                await this.removeUploadedFile(file);



                throw new AppError(
                    'FILE_SAVE_ERROR'
                );


            }






            logger.info(
                `Documento cargado correctamente para el usuario ${id}: ${file.originalname}`
            );




            return updatedUser;





        } catch(error) {



            await this.removeUploadedFile(file);





            if(error instanceof AppError){

                throw error;

            }






            logger.error(
                `Error al guardar documento para el usuario ${id}: ${error.message}`,
                {
                    stack:error.stack
                }
            );





            throw new AppError(
                'FILE_SAVE_ERROR'
            );


        }


    }









    async removeUploadedFile(file) {



        if(!file?.path){

            return;

        }






        try {


            await fs.unlink(file.path);




            logger.info(
                `Archivo eliminado luego de una carga rechazada: ${file.path}`
            );



        } catch(error) {



            if(error.code !== 'ENOENT') {


                logger.error(
                    `No fue posible eliminar el archivo rechazado: ${file.path}`,
                    {
                        stack:error.stack
                    }
                );


            }


        }


    }


}