import { UserModel } from '../models/user.model.js';

import logger from '../config/logger.js';



export class UserRepository {



    async getAll() {

        try {

            return await UserModel
                .find()
                .select('-__v')
                .sort({
                    createdAt: -1
                })
                .lean();


        } catch (error) {


            logger.error(
                `Error obteniendo usuarios: ${error.message}`,
                {
                    stack: error.stack
                }
            );


            throw error;

        }

    }








    async getById(id) {


        try {


            return await UserModel
                .findById(id)
                .select('-__v')
                .lean();



        } catch (error) {


            logger.error(
                `Error buscando usuario ${id}: ${error.message}`,
                {
                    stack: error.stack
                }
            );


            throw error;


        }


    }









    async getByEmail(email) {


        try {


            return await UserModel
                .findOne({
                    email
                })
                .select('-__v')
                .lean();



        } catch(error) {



            logger.error(
                `Error buscando usuario por email ${email}: ${error.message}`,
                {
                    stack:error.stack
                }
            );



            throw error;


        }


    }









    async create(data) {


        try {


            return await UserModel.create(data);



        } catch(error) {


            logger.error(
                `Error creando usuario: ${error.message}`,
                {
                    stack:error.stack
                }
            );


            throw error;


        }


    }









    async addDocument(
        id,
        documentData
    ) {


        try {



            return await UserModel
                .findByIdAndUpdate(

                    id,

                    {
                        $push:{
                            documents: documentData
                        }
                    },

                    {
                        new:true,
                        runValidators:true
                    }

                )
                .select('-__v')
                .lean();




        } catch(error) {



            logger.error(
                `Error agregando documento al usuario ${id}: ${error.message}`,
                {
                    stack:error.stack
                }
            );



            throw error;


        }


    }



}