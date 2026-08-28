import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newUser = await userService.registerUser(req.body);
      res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}