import express from "express";

import {
    register,
    login
} from "../controllers/authController.js";

import {
    validateRegister,
    validateLogin
} from "../middleware/validate.js";

const router = express.Router();

/*
====================================
AUTH ROUTES (WITH VALIDATION)
====================================
*/

/**
 * Register User
 * POST /api/auth/register
 */
router.post(
    "/register",
    validateRegister,
    register
);

/**
 * Login User
 * POST /api/auth/login
 */
router.post(
    "/login",
    validateLogin,
    login
);

export default router;
