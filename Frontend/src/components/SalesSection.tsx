import handshake from "@/assets/handshake-01 1(1)(1).png";
import Back from "@/assets/Back.png";

const SalesSection = () => {



    // Base ImageKit URL (comes from .env)
    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";

    // Define the paths of your images on ImageKit
    const projectImagePath = "/projects/Main/handshake.png";
    const backImagePath = "/projects/Main/Back.png";

    // Build full URLs
    const projectImageURL = `${baseURL}${projectImagePath}`;
    const backImageURL = `${baseURL}${backImagePath}`;


    return (
        <section
            className="relative w-full  bg-white overflow-hidden flex flex-col items-center justify-between bg-cover bg-center"
            style={{ backgroundImage: `url(${backImageURL})` }}
        >
            {/* Large PROJECTS background text - responsive sizing */}
            <div
                className="absolute  left-1/2 -translate-x-1/2 opacity-10 z-30 w-full flex justify-center"
                style={{ top: "clamp(1rem, 2vh, 4rem)" }}
            >
                <h1
                    className="relative  font-extrabold leading-none tracking-tight text-white whitespace-nowrap"
                    style={{
                        fontSize: "clamp(4rem, 12vw, 20rem)",
                        WebkitTextStroke: "clamp(2px, 0.15vw, 3px) black",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    FOR SALE
                </h1>
            </div>


            {/* Top content */}
            <div
                className="relative z-10 w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center gap-6 md:gap-4"
                style={{
                    maxWidth: "clamp(75rem, 85vw, 120rem)",
                    marginTop: "clamp(2rem, 8vh, 12rem)",
                }}
            >
                {/* Left - DESIGNED */}
                <div className="flex flex-col items-center md:items-start mt-10">
                    <h4
                        className="font-semibold text-black"
                        style={{
                            fontSize: "clamp(2rem, 4vw, 6rem)",
                            marginBottom: "clamp(1rem, 3vh, 3rem)"
                        }}
                    >
                        DESIGNED
                    </h4>
                </div>

                {/* Center - Building + circle */}
                <div className="relative flex items-center justify-center w-full"
                    style={{ marginTop: "clamp(1rem, 3vh, 4rem)" }}
                >
                    {/* Yellow circle - responsive sizing */}
                    <div
                        className="absolute bg-[#D7DF21] rounded-full z-0"
                        style={{
                            width: "clamp(20rem, 32vw, 45rem)",
                            height: "clamp(20rem, 32vw, 45rem)",
                        }}
                    ></div>
                    {/* Building image - responsive sizing */}
                    <img
                        src={projectImageURL}
                        alt="Modern apartment building"
                        className="relative z-10 max-w-none object-cover  mt-10 mb-20"
                        style={{
                            width: "clamp(25rem, 38vw, 56rem)",
                        }}
                    />
                </div>

                {/* Right - FOR LIFE */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right mt-10">
                    <h1
                        className="font-semibold text-black"
                        style={{
                            fontSize: "clamp(2rem, 4vw, 6rem)",
                            marginBottom: "clamp(1rem, 3vh, 3rem)"
                        }}
                    >
                        FOR LIFE.
                    </h1>
                </div>
            </div>

            {/* Bottom Stats Section */}

        </section>
    );
};

export default SalesSection ;



