// Add this function to auto-approve users during registration
export async function register(req, res) {
    try {
        const {
            full_name,
            username,
            email,
            password
        } = req.body;

        if (!full_name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const emailExists = await findUserByEmail(email);
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const usernameExists = await findUserByUsername(username);
        if (usernameExists) {
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Auto-approve for testing (remove this in production)
        const newUser = await pool.query(
            `INSERT INTO users (full_name, username, email, password, status)
             VALUES ($1, $2, $3, $4, 'approved')
             RETURNING *`,
            [full_name, username, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful! Your account is approved.",
            user: {
                id: newUser.rows[0].id,
                full_name: newUser.rows[0].full_name,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email,
                status: newUser.rows[0].status
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
}
