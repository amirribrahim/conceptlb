// src/components/PropertySearch.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import TheOutlineMain from "@/assets/TheOutlineMain.png";

interface Project {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    price?: string;
    location?: string;
    area?: number;
    rooms?: number;
    type?: string; // "sales" or "project"
    [key: string]: any;
}

const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";

const PropertySearch = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Fetch all projects, but show only those with type === "sales"
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/projects`);
                if (!res.ok) {
                    console.error("Projects fetch failed:", res.status, await res.text());
                    setProjects([]);
                    return;
                }
                const data = await res.json();
                const filtered = data.filter((p: Project) => (p.type || "").toLowerCase() === "sales");
                setProjects(filtered);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
        );
    };

    const getImageSrc = (img?: string) => {
        if (!img) return TheOutlineMain;
        try {
            if (img.startsWith("http://") || img.startsWith("https://")) return img;
            if (img.startsWith("/")) return `${API_BASE}${img}`;
            return `${API_BASE}/${img}`;
        } catch {
            return TheOutlineMain;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            {/* Header Section */}

            <div className="text-center py-12 relative overflow-hidden">
                <h1 className="text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-2">
                    <span className="text-5xl text-gray-300">“</span>
                    EFFORTLESS PROPERTY SEARCH. EXCEPTIONAL RESULTS.
                    <span className="text-5xl text-gray-300">”</span>
                </h1>
            </div>

          

            {/* Loading / No Results */}
            {loading ? (
                <div className="text-center text-gray-500 py-12">Loading properties…</div>
            ) : projects.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No sales properties found.
                </div>
            ) : (
                // Properties Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((property) => (
                        <div
                            key={property._id}
                            className="bg-property-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Property Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={getImageSrc(property.image)}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        ((e.currentTarget as HTMLImageElement).src = TheOutlineMain)
                                    }
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <button
                                    onClick={() => toggleFavorite(property._id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                >
                                    <Heart
                                        className={`h-5 w-5 ${favorites.includes(property._id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-600"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Property Details */}
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-lg text-property-card-foreground">
                                    {property.title}
                                </h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Location: {property.location || "Not specified"}</p>
                                    <p>
                                        Total Area:{" "}
                                        <span className="font-medium">{property.area || "-"} m²</span>
                                    </p>
                                    <p>
                                        Number Of Rooms:{" "}
                                        <span className="font-medium">{property.rooms || "-"}</span>
                                    </p>
                                </div>

                                {/* Price and Details Button */}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-lg text-property-card-foreground">
                                        {property.price || "Price on request"}
                                    </span>
                                    <Button asChild variant="property-details">
                                        <Link to={`/projects/${property._id}`}>DETAILS</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertySearch;