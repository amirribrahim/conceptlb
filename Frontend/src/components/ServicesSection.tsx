import realEstateDevelopment from "@/assets/real-estate-development.png";
import interiorDesign from "@/assets/architecture-blue-print.png";
import legalTransactions from "@/assets/legal-transactions.png";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "REAL ESTATE DEVELOPMENT",
      description: "We help you buy, sell, or rent residential and commercial properties with expert market knowledge and personalized guidance.",
      image: realEstateDevelopment,
      alt: "3D architectural wireframe of modern house development"
    },
    {
      id: 2,
      title: "INTERIOR DESIGN",
      description: "We create modern, functional, and stylish interiors tailored to your taste, turning every space into a reflection of your lifestyle.",
      image: interiorDesign,
      alt: "3D building model with architectural floor plans"
    },
    {
      id: 3,
      title: "LEGAL TRANSACTIONS",
      description: "We handle all legal aspects of real estate, from contracts to registrations, ensuring secure, smooth, and compliant property deals.",
      image: legalTransactions,
      alt: "Professional clipboard with legal documents and pen"
    }
  ];

  return (
    <section className="px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            OUR SERVICES
          </h2>
          <p className="text-black text-lg md:text-2xl font-light leading-relaxed ">
           At Concept, we don’t just sell properties we help people find their lifestyle. From your first home to your next investment, we make the journey seamless, personal, and centered on your goals.
          </p>
        </div>

        {/* Services Grid */}
              {/* Services Grid */}
              <div className="grid md:grid-cols-3 gap-8 justify-items-center">
                  {services.map((service) => (
                      <div
                          key={service.id}
                          className="w-full max-w-sm rounded-3xl p-8 text-center  border-2 border-[#D6DF25]"
                      >
                          {/* Service Image */}
                          <div className="mb-8 flex items-center justify-center">
                              <img
                                  src={service.image}
                                  alt={service.alt}
                                  className="w-full h-70 object-cover rounded-2xl"
                              />
                          </div>

                          <div>
                              <h3 className="text-xl font-semibold text-foreground mb-4 tracking-wide">
                                  {service.title}
                              </h3>

                              {/* Service Description */}
                              <p className="text-foreground leading-relaxed mb-8 font-light">
                                  {service.description}
                              </p>

                              
                          </div>
                      </div>
                  ))}
              </div>

      </div>
    </section>
  );
};

export default ServicesSection;