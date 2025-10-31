import { useEffect, useState } from "react";
import Concept from "../assets/Concept_Logo_Black_April2025-01 2(1)(1).png";

const Preloader = () => {

    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";
    const projectImagePath = "/projects/Main/Concept_Logo_Black_April2025-01 2(1)(1).png";
    const projectImageURL = `${baseURL}${projectImagePath}`;


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading, or wait for real assets to load
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-white">
            <img
                src={projectImageURL}
                alt="Logo"
                className="h-24 w-auto animate-bounce"
            />
            <p className="mt-4 text-lg">Loading...</p>
        </div>
    );
};

export default Preloader;
