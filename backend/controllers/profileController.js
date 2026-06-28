// backend/controllers/profileController.js
import pool from "../config/database.js";
import bcrypt from "bcrypt";
import { 
    findUserById, 
    updateUserProfile, 
    updatePassword,
    usernameExists,
    emailExists 
} from "../models/User.js";

/*
==========================================
Get My Profile
GET /api/profile/me
==========================================
*/

export async function getMyProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                role: user.role,
                status: user.status,
                is_online: user.is_online,
                last_seen: user.last_seen,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile."
        });
    }
}

/*
==========================================
Update Profile
PUT /api/profile/update
==========================================
*/

export async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const { full_name, username, email, bio, location, website } = req.body;

        // Check if username is taken (excluding current user)
        if (username) {
            const existing = await usernameExists(username, userId);
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "Username is already taken."
                });
            }
        }

        // Check if email is taken (excluding current user)
        if (email) {
            const existing = await emailExists(email, userId);
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already in use."
                });
            }
        }

        // Update profile
        const updatedUser = await updateUserProfile(userId, {
            full_name,
            username,
            email,
            bio,
            location,
            website
        });

        // Also update the JWT token info in the response
        const token = req.headers.authorization?.split(' ')[1];

        res.json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile."
        });
    }
}

/*
==========================================
Update Profile Picture
PUT /api/profile/picture
==========================================
*/

export async function updateProfilePicture(req, res) {
    try {
        const userId = req.user.id;
        const { profile_picture } = req.body;

        if (!profile_picture) {
            return res.status(400).json({
                success: false,
                message: "Profile picture URL is required."
            });
        }

        const updatedUser = await updateUserProfile(userId, {
            profile_picture
        });

        res.json({
            success: true,
            message: "Profile picture updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile picture."
        });
    }
}

/*
==========================================
Change Password
PUT /api/profile/password
==========================================
*/

export async function changePassword(req, res) {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters."
            });
        }

        // Get current user with password
        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [userId]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Verify current password
        const isValid = await bcrypt.compare(current_password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await updatePassword(userId, hashedPassword);

        res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to change password."
        });
    }
}

/*
==========================================
Get User Profile by ID
GET /api/profile/:id
==========================================
*/

export async function getUserProfile(req, res) {
    try {
        const { id } = req.params;
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                profile_picture: user.profile_picture || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                is_online: user.is_online,
                last_seen: user.last_seen,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile."
        });
    }
}
