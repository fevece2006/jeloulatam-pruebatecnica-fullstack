"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body } = require('express-validator');
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim()
], authController_1.register);
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], authController_1.login);
router.get('/profile', auth_1.authenticateToken, authController_1.getProfile);
exports.default = router;
