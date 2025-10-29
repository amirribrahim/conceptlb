import { Button } from "@/components/ui/button";
import modernApartment from "@/assets/modern-apartment.jpg";

const HeroSection = () => {
  return (
    <section className="relative px-8 py-16 bg-concept-bg overflow-hidden">
      {/* Large CONCEPT background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <span className="text-[20rem] font-bold text-muted-foreground/30 select-none leading-none">
          CONCEPT
        </span>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left side - DESIGNED */}
          <div className="flex flex-col items-start">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
              DESIGNED
            </h1>
            <Button 
              variant="default"
              className="bg-brand-yellow text-accent-foreground hover:bg-brand-yellow/90 px-6 py-3 rounded-full font-semibold"
            >
              CHAT WITH US
            </Button>
          </div>
          
          {/* Center - Building image with yellow circle */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-brand-yellow rounded-full -z-10"></div>
            <img 
              src={modernApartment}
              alt="Modern apartment building" 
              className="relative z-10 w-72 h-96 object-cover"
            />
          </div>
          
          {/* Right side - FOR LIFE */}
          <div className="flex flex-col items-end text-right">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
              FOR LIFE.
            </h1>
            <Button 
              variant="default"
              className="bg-brand-yellow text-accent-foreground hover:bg-brand-yellow/90 px-6 py-3 rounded-full font-semibold"
            >
              CHECK SERVICES
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;