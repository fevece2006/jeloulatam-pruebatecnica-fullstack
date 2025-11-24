"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
class AuthService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async register(email, password, name) {
        // Validar que el usuario no existe
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
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
    async login(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }
    async getUserProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            return null;
        }
        return this.sanitizeUser(user);
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    }
    sanitizeUser(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
