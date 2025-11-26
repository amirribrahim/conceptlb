// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
    try {
        console.log("LOGIN HIT - body:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        console.log("DB user found:", !!user);
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("bcrypt compare result:", isMatch);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment");
            return res.status(500).json({ message: "Server misconfiguration (no JWT secret)" });
        }

        // Create JWT token (wrap in try to catch jwt errors)
        let token;
        try {
            token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
        } catch (jwtErr) {
            console.error("JWT sign error:", jwtErr);
            return res.status(500).json({ message: "Token generation failed" });
        }

        // Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ message: "Login successful" });
    } catch (err) {
        console.error("Login route error:", err);
        return res.status(500).json({ message: "Server error" });
    }

    // POST /api/auth/logout
    router.post("/logout", (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.json({ message: "Logged out successfully" });
    });

});

module.exports = router;
