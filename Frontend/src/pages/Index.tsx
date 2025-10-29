import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhyUsSection from "@/components/WhyUsSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <Header />
            <HeroSection />
            <WhyUsSection />
            <ServicesSection />
            <Footer />
        </div>
    );
};

export default Index; 