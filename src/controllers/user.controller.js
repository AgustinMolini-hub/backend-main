import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        status: 'success',
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const newUser = await userService.registerUser(req.body);

      return res.status(201).json({
        status: 'success',
        payload: newUser
      });
    } catch (error) {
      next(error);
    }
  }
}
