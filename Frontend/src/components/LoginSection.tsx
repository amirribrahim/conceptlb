import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component from your UI library
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import Back from "@/assets/Back.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // For handling form state

const LoginSection = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Base ImageKit URL (comes from .env)
    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";

    // Define the paths of your images on ImageKit
    const backImagePath = "/projects/Main/Back.png";

    // Build full URLs
    const backImageURL = `${baseURL}${backImagePath}`;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Trying to login with:", email, password); // Step 1: log credentials

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            console.log("Fetch response received:", res); // Step 2: log response object

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                console.error("Login error response:", data);
                alert(data.message || "Login failed");
                return;
            }

            const data = await res.json();
            console.log("Login success:", data); // Step 3: log successful response
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Fetch failed:", err); // Step 4: log actual fetch error
            alert("Failed to connect to the server. Check if backend is running and CORS is configured.");
        }
    };




    return (
        <section
            className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${backImageURL})` }}
        >
            {/* Large LOGIN background text - responsive sizing */}
            <div
                className="absolute left-1/2 -translate-x-1/2 opacity-5 z-10 w-full flex justify-center"
                style={{ top: "clamp(1rem, 2vh, 4rem)" }}
            >
                <h1
                    className="relative font-extrabold leading-none tracking-tight text-gray-200 whitespace-nowrap"
                    style={{
                        fontSize: "clamp(4rem, 12vw, 20rem)",
                        WebkitTextStroke: "clamp(1px, 0.1vw, 2px) #333",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    LOGIN
                </h1>
            </div>

            {/* Main content grid */}
            <div
                className="relative z-20 w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center gap-6 md:gap-4"
                style={{
                    maxWidth: "clamp(75rem, 85vw, 120rem)",
                }}
            >
                {/* Left - WELCOME */}
                <div className="flex flex-col items-center md:items-start">
                    <h4
                        className="font-bold text-gray-800 tracking-wide"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 4rem)",
                            marginBottom: "clamp(0.5rem, 2vh, 2rem)"
                        }}
                    >
                        WELCOME
                    </h4>
                    <p className="text-gray-600 text-center md:text-left" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)" }}>
                        Sign in to access the admin dashboard 
                    </p>
                </div>

                {/* Center - Login Form + circle */}
                <div className="relative flex items-center justify-center w-full">
                    {/* Yellow circle - responsive sizing */}
                    <div
                        className="absolute bg-[#D7DF21] rounded-full z-0 opacity-20"
                        style={{
                            width: "clamp(25rem, 35vw, 50rem)",
                            height: "clamp(25rem, 35vw, 50rem)",
                        }}
                    ></div>
                    {/* Login Form - clean and professional */}
                    <div
                        className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-200"
                        style={{
                            width: "clamp(22rem, 28vw, 35rem)",
                        }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign In</h2>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="off"   
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7DF21] focus:border-transparent transition duration-200"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7DF21] focus:border-transparent transition duration-200"
                                />
                            </div>
                           
                            <Button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold"
                            >
                                Sign In
                            </Button>
                        </form>
                       
                    </div>
                </div>

                {/* Right - BACK */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                   
                </div>
            </div>
        </section>
    );
};

export default LoginSection;
