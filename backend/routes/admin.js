import express from "express";

import {
    getDashboard,
    getUsers,
    approveUser,
    blockUser,
    deleteUser
} from "../controllers/adminController.js";

import {
    authenticateToken,
    requireAdmin
} from "../middleware/auth.js";

const router = express.Router();

/*
==========================================
Admin Routes
Base URL: /api/admin
==========================================
*/

/*
Dashboard Statistics
GET /api/admin/dashboard
*/
router.get(
    "/dashboard",
    authenticateToken,
    requireAdmin,
    getDashboard
);

/*
Get All Users
GET /api/admin/users
*/
router.get(
    "/users",
    authenticateToken,
    requireAdmin,
    getUsers
);

/*
Approve User
PUT /api/admin/users/:id/approve
*/
router.put(
    "/users/:id/approve",
    authenticateToken,
    requireAdmin,
    approveUser
);

/*
Block User
PUT /api/admin/users/:id/block
*/
router.put(
    "/users/:id/block",
    authenticateToken,
    requireAdmin,
    blockUser
);

/*
Delete User
DELETE /api/admin/users/:id
*/
router.delete(
    "/users/:id",
    authenticateToken,
    requireAdmin,
    deleteUser
);

export default router;
