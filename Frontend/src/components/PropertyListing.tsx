import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import TheOutlineMain from "../assets/TheOutlineMain.png"; // fallback image

const API_URL = import.meta.env.VITE_API_URL || "https://www.conceptlb.com/api";
const PropertyListing = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // project ID from URL

    const [project, setProject] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path?: string) => {
        if (!path) return TheOutlineMain;
        if (path.startsWith("http")) return path; // full URL
        if (path.startsWith("/")) return `${API_URL}${path}`; // relative from root
        return `${API_URL}/${path}`; // fallback for relative paths
    };

    // Fetch project details by ID
    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/projects/${id}`);
                if (!res.ok) throw new Error(`Project not found`);
                const data = await res.json();
                setProject(data);
            } catch (err) {
                console.error("Error fetching project:", err);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-xl">Loading project details...</div>;
    }

    if (!project) {
        return <div className="p-8 text-center text-xl">Project not found</div>;
    }

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Hero Section */}
            <section className="relative w-full h-screen overflow-hidden rounded-3xl mb-12">
                {/* Back button */}
                <button
                    onClick={() => navigate("/projects")}
                    className="absolute left-6 top-6 z-20 w-12 h-12 bg-[#D7DF21] rounded-full flex items-center justify-center shadow-lg"
                    aria-label="Back to projects"
                >
                    <ChevronLeft className="w-6 h-6 text-black" />
                </button>

                {/* Full-height image */}
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(project.image)}
                        alt={project.name || project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Centered overlay text */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
                        Project Name: {project.name || project.title}
                    </h1>
                </div>
            </section>


            {/* Project Description */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <p className="text-black text-lg md:text-3xl font-light leading-relaxed">
                    {project.description?.trim() || "Description not available for this project."}
                </p>
            </div>

            {/* Layout and Floor Plan */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
                {/* Floor Plan */}
                <div className="bg-white rounded-2xl border-2 border-[#D7DF21] shadow-lg p-6 flex flex-col">
                    <h2 className="text-4xl font-light mb-6">Floor Plan</h2>
                    <img
                        src={getImageUrl(project.mapImage)}
                        alt={project.name || project.title}
                        className="w-full h-full object-cover "
                    />
                </div>

                {/* House Layout Details */}
                <div className="bg-[#D7DF21] rounded-2xl shadow-lg p-6 border-2 border-[#D7DF21]">
                    <h2 className="text-4xl font-light mb-16">Layout</h2>
                    <div>
                        {project.layout &&
                            Object.entries(project.layout)
                                .filter(([key]) => key !== "_id") // <-- ignore _id
                                .map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between bg-white mb-10 items-center p-4 rounded-2xl border-2 border-[#D7DF21] shadow-sm"
                                    >
                                        <span className="capitalize font-medium text-gray-900">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </span>
                                        <span className="font-semibold">{value}</span>
                                    </div>
                                ))}
                    </div>
                </div>
            </div>

            {/* Rooms Section */}
            <div className="max-w-6xl mx-auto mb-12 space-y-12">
                {project.rooms && project.rooms.length > 0 ? (
                    project.rooms.map((room: any, idx: number) => (
                        <div key={idx} className="border-2 rounded-2xl shadow-lg p-6">
                            <h3 className="text-3xl font-light text-black mb-6 pl-4 border-l-4 border-[#D7DF21]">
                                {room.name}
                            </h3>

                            <p className="text-gray-500 mb-4">
                                {room.size && `Size: ${room.size}`}
                            </p>

                            {/* Horizontal Scrollable Photos */}
                            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {room.photos?.map((photo: string, pIdx: number) => (
                                    <img
                                        key={pIdx}
                                        src={getImageUrl(photo)}
                                        alt={`${room.name} ${pIdx + 1}`}
                                        className="w-96 h-72 object-cover rounded-xl flex-shrink-0 hover:scale-105 transition-transform duration-300 cursor-pointer"
                                        onClick={() => setSelectedImage(getImageUrl(photo))}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg">No rooms available</p>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg"
                    >
                        <X className="w-6 h-6 text-black" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-w-4xl max-h-[80vh] rounded-xl shadow-lg"
                    />
                </div>
            )}
        </div>
    );
};

export default PropertyListing;