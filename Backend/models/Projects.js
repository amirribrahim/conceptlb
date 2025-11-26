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

