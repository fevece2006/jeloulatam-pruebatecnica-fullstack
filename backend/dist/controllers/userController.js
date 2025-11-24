"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const controllerHelpers_1 = require("../utils/controllerHelpers");
const getUsers = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const users = await userRepository.find({
            select: ['id', 'email', 'name', 'createdAt', 'updatedAt']
        });
        res.json(users);
    }
    catch (error) {
        (0, controllerHelpers_1.handleError)(res, error, 'Error al obtener usuarios');
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: parseInt(id) },
            select: ['id', 'email', 'name', 'createdAt', 'updatedAt']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        (0, controllerHelpers_1.handleError)(res, error, 'Error al obtener usuario');
    }
};
exports.getUserById = getUserById;
