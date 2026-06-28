export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // ✅ Remove pending/blocked checks since all users are auto-approved
        // Users are always 'approved' now

        const token = generateToken(user);

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
}
