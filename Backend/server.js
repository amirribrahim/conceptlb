// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads/projects folder if missing
const uploadsDir = path.join(__dirname, "uploads");
const projectsDir = path.join(uploadsDir, "projects");
fs.mkdirSync(projectsDir, { recursive: true });

app.use(express.json());
app.use(cookieParser()); // must be before routes that read req.cookies

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080"], // add both dev origins
    credentials: true
}));

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// ✅ Routes
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));
