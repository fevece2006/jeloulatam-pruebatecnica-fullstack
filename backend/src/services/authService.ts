import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string, name: string) {
    // Validar que el usuario no existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name
    });

    await this.userRepository.save(user);

    // Generar JWT
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId }
    });
    
    if (!user) {
      return null;
    }
    
    return this.sanitizeUser(user);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  private sanitizeUser(user: User): any {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}