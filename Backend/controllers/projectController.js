import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
        const {
            title, description, category,
            totalArea, floors, layoutRooms,
            bathrooms, ceilingHeight, rooms
        } = req.body;

        const parsedRooms = rooms ? JSON.parse(rooms) : [];

        const image = req.files?.image ? `/uploads/projects/${req.files.image[0].filename}` : null;
        const mapImage = req.files?.mapImage ? `/uploads/projects/${req.files.mapImage[0].filename}` : null;

        parsedRooms.forEach((room, index) => {
            if (req.files[`roomImages_${index}`]) {
                room.images = req.files[`roomImages_${index}`].map(f => `/uploads/rooms/${f.filename}`);
            }
        });

        const project = await Project.create({
            title,
            description,
            type,
            image,
            mapImage,
            layout: parsedLayout,
            rooms: parsedRooms,
        });

        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating project" });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching projects" });
    }
};

