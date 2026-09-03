import { UserService } from '../services/user.service.js';

const userService = new UserService();


export class UserController {


    static async getAll(req, res, next) {

        try {

            const {
                page,
                limit
            } = req.query;


            const result =
                await userService.getAllUsers(
                    page,
                    limit
                );


            return res.status(200).json({

                status: 'success',

                payload: result.data,

                pagination: result.pagination

            });


        } catch (error) {

            next(error);

        }

    }


    static async getById(req, res, next) {

        try {

            const user =
                await userService.getUserById(
                    req.params.id
                );


            return res.status(200).json({

                status: 'success',

                payload: user

            });


        } catch (error) {

            next(error);

        }

    }


    static async create(req, res, next) {

        try {

            const newUser =
                await userService.registerUser(
                    req.body
                );


            return res.status(201).json({

                status: 'success',

                payload: newUser

            });


        } catch (error) {

            next(error);

        }

    }


    static async uploadDocument(req, res, next) {

        try {

            const {
                id
            } = req.params;


            const {
                documentType
            } = req.body;


            const updatedUser =
                await userService.uploadDocument(

                    id,

                    req.file,

                    documentType

                );


            return res.status(200).json({

                status: 'success',

                payload: updatedUser

            });


        } catch (error) {

            next(error);

        }

    }


}