import { useState } from "react";
import Concept from "../assets/Concept_Logo_Black_April2025-01 2(1)(1).png";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Menu, X } from "lucide-react";


const Header = () => {


    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";
    const projectImagePath = "/projects/Main/Concept_Logo_Black_April2025-01 2(1)(1).png";
    const projectImageURL = `${baseURL}${projectImagePath}`;


    // WhatsApp number in international format without plus or spaces:
    const whatsappNumber = "96103002520";
    // Optional default message (URL-encoded)
    const defaultMessage = encodeURIComponent("Hello Concept , I would like to inquire about your services.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

    const [menuOpen, setMenuOpen] = useState(false);
    const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "development";
    const navigation = [
        { name: "HOME", to: "/" },
   
        { name: "PROJECTS", to: "/Projects" },
        { name: "FORSALE", to: "/ForSale" },
        { name: "CONTACT", to: "/Contact" },
        // Only add ADMIN link if in development
        ...(isDevelopment ? [{ name: "ADMIN", to: "/Admin" }] : []),
    ];

    return (
        <header className="w-full sticky top-0 z-50 flex justify-center mb-4 mt-5  ">
            {/* Main rounded container */}
            <div className="flex items-center justify-between w-[90%] max-w-6xl bg-[#EDEDED] rounded-full px-6 py-3 shadow-sm border border-gray-200 relative z-50">

                {/* Logo */}
                <Link to="/" className="flex items-center relative" aria-label="Go to homepage">
                    <img
                        src={projectImageURL}
                        alt="Upscale Logo"
                        className="h-10 w-auto object-contain scale-125 -ml-2 cursor-pointer"
                    />
                </Link>

                {/* Desktop Nav links */}
                <nav className="hidden md:flex items-center space-x-10">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.to}
                            className="relative text-sm font-semibold tracking-wide text-black hover:text-[#D7DF21] transition-colors duration-300 group"
                        >
                            {item.name}
                            <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-gradient-to-r from-[#D7DF21]  transition-all duration-300 group-hover:w-full rounded"></span>
                        </Link>
                    ))}
                </nav>

                {/* Social + Hamburger */}
                <div className="flex items-center space-x-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full text-black bg-[#D6DF25] hover:bg-[#D6DF25]/50 transition-all duration-300"
                    >
                        <FaWhatsapp className="h-5 w-5" />
                    </a>

                    <a
                        href="https://instagram.com/concept_contracting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full text-black bg-[#D6DF25] hover:bg-[#D6DF25]/50 transition-all duration-300"
                    >
                        <FaInstagram className="h-5 w-5" />
                    </a>

                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 transition"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-40 md:hidden">
                    <nav className="flex flex-col items-center py-4 space-y-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-center text-sm font-semibold tracking-wide text-gray-700 hover:text-blue-600 transition-colors duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
