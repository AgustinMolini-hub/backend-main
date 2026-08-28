import { UserRepository } from '../repositories/user.repository.js';
import { ROLES } from '../constants/index.js';
import { AppError } from '../errors/app.error.js';

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepo.getAll();
  }

  async registerUser(data) {
    if (!data.email || !data.name) {
      throw new AppError('INVALID_USER_DATA');
    }

    const existingUser = await this.userRepo.getByEmail(data.email);

    if (existingUser) {
      throw new AppError('USER_ALREADY_EXISTS', {
        email: data.email
      });
    }

    const role = Object.values(ROLES).includes(data.role)
      ? data.role
      : ROLES.USER;

    return await this.userRepo.create({
      ...data,
      role
    });
  }
}
