
// src/components/RealEstateExterior.tsx
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TheOutlineMain from "@/assets/TheOutlineMain.png";

interface Project {
    _id: string;
    title: string;
    image?: string;
    description?: string;
    // backend may use `type` or (older code) `category`
    type?: string;
    category?: string;
    [key: string]: any;
}

const API_BASE = import.meta.env.VITE_API_URL as string || "/api";
const ProjectCarousel = ({
    title,
    description,
    projects,
}: {
    title: string;
    description: string;
    projects: Project[];
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState<number>(3);

    // determine visibleCount responsive
    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            setVisibleCount(w < 768 ? 1 : 3);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    // reset index when projects change (avoid out-of-range index)
    useEffect(() => {
        setCurrentIndex(0);
    }, [projects]);

    const nextSlide = useCallback(() => {
        if (!projects || projects.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, [projects]);

    const prevSlide = useCallback(() => {
        if (!projects || projects.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }, [projects]);

    const getVisibleProjects = () => {
        const out: Project[] = [];
        if (!projects || projects.length === 0) return out;
        const count = Math.min(visibleCount, projects.length);
        for (let i = 0; i < count; i++) {
            const idx = (currentIndex + i) % projects.length;
            out.push(projects[idx]);
        }
        return out;
    };

    // helper to prefix image URLs if they are relative (start with "/uploads" etc.)
    const getImageSrc = (img?: string) => {
        if (!img) return TheOutlineMain;

        // ImageKit URLs (or any full URLs) are already complete
        if (img.startsWith("http://") || img.startsWith("https://")) {
            return img;
        }

        // Fallback for legacy local images (if any exist from before)
        if (img.startsWith("/uploads")) {
            return `${API_BASE}${img}`;
        }

        // Default fallback
        return TheOutlineMain;
    };

    if (!projects || projects.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
                <div className="text-lg font-medium">{title}</div>
                <div className="mt-2">No projects available for this section.</div>
            </div>
        );
    }


    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-real-estate-text">{title}</h2>
                <p className="text-black text-sm md:text-lg font-light leading-relaxed">{description}</p>
            </div>

            <div className="relative flex flex-col items-center">
                {/* Mobile arrows above carousel */}
                <div className="flex md:hidden justify-between w-full max-w-xs mb-6">
                    <button
                        onClick={prevSlide}
                        aria-label="Previous"
                        className="w-10 h-10 bg-[#D6DF25] hover:bg-[#D6DF25]/50 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5 text-real-estate-text" />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next"
                        className="w-10 h-10 bg-[#D6DF25] hover:bg-[#D6DF25]/50 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5 text-real-estate-text" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 mr-5 md:mx-16 w-full">
                    {getVisibleProjects().map((project) => (
                        <article
                            key={project._id}
                            className="bg-real-estate-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                <img
                                    src={getImageSrc(project.image)}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // fallback to placeholder if broken
                                        (e.currentTarget as HTMLImageElement).src = TheOutlineMain;
                                    }}
                                />
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl text-center font-semibold mb-4 text-real-estate-text">{project.title}</h3>
                                <p className="text-sm text-real-estate-text-muted mb-6 leading-relaxed">
                                    {project.description || ""}
                                </p>
                                <Button asChild className="w-full text-black bg-[#D6DF25] hover:bg-[#D6DF25]/50 rounded-full">
                                    <Link to={`/projects/${project._id}`}>VIEW PROJECT</Link>
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Desktop side arrows */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous"
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#D6DF25] hover:bg-[#D6DF25]/50 rounded-full items-center justify-center shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6 text-real-estate-text" />
                </button>

                <button
                    onClick={nextSlide}
                    aria-label="Next"
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#D6DF25] hover:bg-[#D6DF25]/50 rounded-full items-center justify-center shadow-lg"
                >
                    <ChevronRight className="w-6 h-6 text-real-estate-text" />
                </button>

            </div>
        </section>
    );
};

export const RealEstateExterior = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/projects`);
                if (!res.ok) {
                    console.error("Projects fetch failed:", res.status, await res.text());
                    setProjects([]);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                console.log("Fetched projects from API:", data);
                setProjects(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // tolerant normalization for `type` or `category`
    const normalizeType = (p: Project) => {
        const raw = (p.type || p.category || "").toString();
        return raw.trim().toLowerCase();
    };

    // groups
    const interior = projects.filter((p) => normalizeType(p) === "interior");
    const exterior = projects.filter((p) => normalizeType(p) === "exterior");
    const both = projects.filter((p) => normalizeType(p) === "both");

    // If still loading, show a simple placeholder
    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="text-gray-500">Loading projects…</div>
            </div>
        );
    }

    // If no projects at all
    if (!projects.length) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
                No projects found in the database. Check server / API.
            </div>
        );
    }

    return (
        <>
            <ProjectCarousel
                title="INTERIOR"
                description="Explore our stunning interior designs that blend comfort, style, and functionality."
                projects={interior}
            />
            <ProjectCarousel
                title="EXTERIOR"
                description="Discover our modern and timeless exterior projects that redefine real estate development."
                projects={exterior}
            />
            <ProjectCarousel
                title="INTERIOR & EXTERIOR"
                description="A perfect harmony of inside and outside — projects that combine elegance and practicality."
                projects={both}
            />
        </>
    );
};