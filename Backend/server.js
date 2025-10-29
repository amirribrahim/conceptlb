// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// create uploads/projects folder if missing
const uploadsDir = path.join(__dirname, "uploads");
const projectsDir = path.join(uploadsDir, "projects");
fs.mkdirSync(projectsDir, { recursive: true });

app.use(cors());
app.use(express.json());
// serve uploaded files
app.use("/uploads", express.static(uploadsDir));


// Middleware
app.use(cors());
app.use(express.json()); // for JSON bodies
// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Routes (require after static config)
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));
