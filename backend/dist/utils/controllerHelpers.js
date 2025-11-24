"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeProject = exports.sanitizeUser = exports.handleError = exports.validateRequest = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');
/**
 * Validates request using express-validator
 * Returns true if valid, false if invalid (and sends error response)
 */
const validateRequest = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    }
    return true;
};
exports.validateRequest = validateRequest;
/**
 * Handles standard error responses
 */
const handleError = (res, error, message) => {
    console.error(`${message}:`, error);
    res.status(500).json({ message });
};
exports.handleError = handleError;
/**
 * Removes password from user object
 */
const sanitizeUser = (user) => {
    if (!user)
        return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.sanitizeUser = sanitizeUser;
/**
 * Sanitizes project with owner and collaborators
 */
const sanitizeProject = (project) => {
    return {
        ...project,
        owner: (0, exports.sanitizeUser)(project.owner),
        collaborators: project.collaborators?.map((c) => (0, exports.sanitizeUser)(c)) || []
    };
};
exports.sanitizeProject = sanitizeProject;
