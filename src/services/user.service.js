import { UserRepository } from '../repositories/user.repository.js';
import { ROLES } from '../constants/index.js';

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepo.getAll();
  }

  async registerUser(data) {
    if (!data.email || !data.name) {
      throw new Error('El nombre y el email son obligatorios.');
    }

    const existingUser = await this.userRepo.getByEmail(data.email);
    if (existingUser) {
      throw new Error('Ya existe un usuario registrado con este email.');
    }

    const role = Object.values(ROLES).includes(data.role) ? data.role : ROLES.USER;

    return await this.userRepo.create({
      ...data,
      role
    });
  }
}