// models/Project.js
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photos: [{ type: String }], // array of image URLs or filenames
});

const LayoutSchema = new mongoose.Schema({
    totalArea: { type: String },
    floors: { type: Number },
    rooms: { type: Number },
    bathrooms: { type: Number },
    ceilingHeight: { type: String },
});

const ProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String }, // cover photo
        mapImage: { type: String }, // map photo (new field)
        layout: LayoutSchema,
        rooms: [RoomSchema],
        type: { type: String, enum: ["interior", "exterior", "both", "sales"], default: "interior" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);

root @srv1038810: /var/www / concept / Backend / models# cd /var/www/concept / Backend
root @srv1038810: /var/www / concept / Backend# cd routes
root @srv1038810: /var/www / concept / Backend / routes# cat authRoutes.js
cat: authRoutes.js: No such file or directory
root @srv1038810: /var/www / concept / Backend / routes# cat authRoutes.js
cat: authRoutes.js: No such file or directory
root @srv1038810: /var/www / concept / Backend / routes# cd /var/www/concept / Backend
root @srv1038810: /var/www / concept / Backend# cat.env
MONGO_URI = mongodb + srv://adminuser:Upscale2025@cluster0.0owpyda.mongodb.net/ConceptProjects?retryWrites=true&w=majority&appName=Cluster0
PORT = 5001
IMAGEKIT_PUBLIC_KEY = public_tcsHTMVU54DcW4uaPnaZR5PXR + k=
IMAGEKIT_PRIVATE_KEY = private_70cOGacFZMs / BoJuHIoRlMZ7X90=
IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/tcn5hrn0h

VITE_EMAILJS_SERVICE_ID = service_uux8fmg
VITE_EMAILJS_TEMPLATE_ID = template_lymiu0f
VITE_EMAILJS_PUBLIC_KEY = tPHrqLP - vpqk8uxAB
root @srv1038810: /var/www / concept / Backend# cd routes
root @srv1038810: /var/www / concept / Backend / routes# cat projectRoutes.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const multer = require("multer");
const imagekit = require("../utils/imagekit"); // Import ImageKit

// Multer config - now using memory storage instead of disk
const storage = multer.memoryStorage(); // Store files in memory temporarily

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

const multi = upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "mapImage", maxCount: 1 },
    { name: "roomImages", maxCount: 200 },
]);
function sanitizeFolderName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_"); // replaces spaces and special characters with _
}

// =======================
// HELPER: Upload to ImageKit
// =======================
async function uploadToImageKit(file, folder = 'projects') {
    try {
        const result = await imagekit.upload({
            file: file.buffer, // File buffer from multer memory storage
            fileName: file.originalname,
            folder: folder,
            useUniqueFileName: true,
            tags: ['project'] // Optional: helps organize in ImageKit
        });
        return result.url; // Return the full ImageKit URL
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error(`ImageKit upload failed: ${error.message}`);
    }
}

// =======================
// GET all projects
// =======================
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching projects", error: err.message });
    }
});

// =======================
// GET single project
// =======================
router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Error fetching project", error: err.message });
    }
});

// =======================
// CREATE project
// =======================
router.post("/", multi, async (req, res) => {
    try {
        const { title, description, type } = req.body;

        const layout = req.body.layout ? JSON.parse(req.body.layout) : {};
        const roomsMeta = req.body.rooms ? JSON.parse(req.body.rooms) : [];
        const roomFilesCounts = req.body.roomFilesCounts
            ? req.body.roomFilesCounts.split(",").map((n) => parseInt(n || "0", 10))
            : [];

        // Upload room images to ImageKit
        const roomFiles = req.files?.roomImages || [];
        let idx = 0;

        const folderName = sanitizeFolderName(title);
        const rooms = [];
        for (let i = 0; i < roomsMeta.length; i++) {
            const room = roomsMeta[i];
            const photos = Array.isArray(room.photos) ? [...room.photos] : [];
            const newCount = roomFilesCounts[i] || 0;

            for (let j = 0; j < newCount; j++) {
                const file = roomFiles[idx++];
                if (file) {
                    const imageUrl = await uploadToImageKit(file, `projects/${folderName}/rooms`);
                    photos.push(imageUrl);
                }
            }

            rooms.push({ name: room.name || "", photos });
        }


        // Upload cover image to ImageKit
        let coverImage = req.body.coverImageURL || "";
        if (req.files?.coverImage?.[0]) {
            coverImage = await uploadToImageKit(req.files.coverImage[0], `projects/${folderName}`);
        }

        // Upload map image to ImageKit
        let mapImage = req.body.mapImageURL || "";
        if (req.files?.mapImage?.[0]) {
            mapImage = await uploadToImageKit(req.files.mapImage[0], `projects/${folderName}`);
        }

        const project = await Project.create({
            title,
            description,
            type,
            layout,
            rooms,
            image: coverImage,
            mapImage,
        });

        res.status(201).json(project);
    } catch (err) {
        console.error("Create Project Error:", err);
        res.status(500).json({ message: "Failed to create project", error: err.message });
    }
});

// =======================
// UPDATE project
// =======================
router.put("/:id", multi, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const { title, description, type } = req.body;
        const layout = req.body.layout ? JSON.parse(req.body.layout) : {};
        const roomsMeta = req.body.rooms ? JSON.parse(req.body.rooms) : [];
        const roomFilesCounts = req.body.roomFilesCounts
            ? req.body.roomFilesCounts.split(",").map((n) => parseInt(n || "0", 10))
            : [];

        // Upload room images to ImageKit
        const roomFiles = req.files?.roomImages || [];
        let idx = 0;

        const rooms = [];
        for (let i = 0; i < roomsMeta.length; i++) {
            const room = roomsMeta[i];
            const photos = Array.isArray(room.photos) ? [...room.photos] : [];
            const newCount = roomFilesCounts[i] || 0;

            // Upload new files to ImageKit
            for (let j = 0; j < newCount; j++) {
                const file = roomFiles[idx++];
                if (file) {
                    const imageUrl = await uploadToImageKit(file, `projects/${sanitizeFolderName(title)}/rooms`);
                    photos.push(imageUrl);
                }
            }

            rooms.push({ name: room.name || "", photos });
        }

        // Upload cover image to ImageKit if new file provided
        let coverImage = req.body.coverImageURL || project.image;
        if (req.files?.coverImage?.[0]) {
            coverImage = await uploadToImageKit(req.files.coverImage[0], `projects/${sanitizeFolderName(title)}`);
        }

        // Upload map image to ImageKit if new file provided
        let mapImage = req.body.mapImageURL || project.mapImage;
        if (req.files?.mapImage?.[0]) {
            mapImage = await uploadToImageKit(req.files.mapImage[0], `projects/${sanitizeFolderName(title)}`);
        }

        project.title = title;
        project.description = description;
        project.type = type;
        project.layout = layout;
        project.rooms = rooms;
        project.image = coverImage;
        project.mapImage = mapImage;

        await project.save();
        res.json(project);
    } catch (err) {
        console.error("Update Project Error:", err);
        res.status(500).json({ message: "Failed to update project", error: err.message });
    }
});

// =======================
// DELETE project
// =======================
router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Note: ImageKit files remain in cloud storage
        // If you want to delete them from ImageKit too, you'd need to extract
        // the fileId from the URL and call imagekit.deleteFile(fileId)
        // For now, we'll just delete the database record

        await project.deleteOne();
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error("Delete Project Error:", err);
        res.status(500).json({ message: "Failed to delete project", error: err.message });
    }
});