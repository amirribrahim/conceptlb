import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectsSection from "@/components/ProjectsSection";
import { RealEstateExterior } from "@/components/RealEstateExterior";
const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProjectsSection />
      <RealEstateExterior />
      <Footer /> 
    </div>
  );
};

export default Projects;
