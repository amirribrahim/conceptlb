import { Button } from "@/components/ui/button";
import modernApartment from "@/assets/modern-apartment.png";
import Interior1 from "@/assets/Interior1.jpeg";
import Back1 from "@/assets/Back.png";

const ProjectsTest = () => {
    return (
        <section
            className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col items-center justify-between bg-cover bg-center "
        >

            <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-10 z-30">
                <h1
                    className="relative text-[15rem] font-extrabold leading-none tracking-tight text-white"
                    style={{
                        WebkitTextStroke: "2px black",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    CONCEPT
                </h1>
            </div>

            <div className="relative z-1 w-full max-w-7xl px-8  items-center mt-0 top-2">

                <div className="relative flex items-center justify-center w-full mt-10  z-0">

                    <img
                        src={Interior1}
                        alt="Modern apartment building"
                        className="relative z-10 w-[120rem] h-[80vh] object-cover rounded-3xl "
                    />
                </div>

            </div>

        </section>
    );
};

export default ProjectsTest;