import professionalContractor from "@/assets/professional-contractor.png";

const WhyUsSection = () => {

    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";
    const projectImagePath = "/projects/Main/Man1.png";
    const projectImageURL = `${baseURL}${projectImagePath}`;

  return (
    <section className="px-2 py-16">
      <div className="max-w-7xl mx-auto bg-[#E6E6E6] p-0 rounded-3xl">
        <div className="grid lg:grid-cols-2 gap-8 rounded-2xl items-center bg-[#E6E6E6] p-0">
          {/* Left side - Content */}
          <div className="space-y-6 mr-30 p-10">
            <h2 className="text-5xl lg:text-6xl font-semibold text-foreground">
              WHY US?
            </h2>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-4">
              <span className="bg-[#D7DF21] text-accent-foreground px-6 py-2 rounded-full text-sm font-semibold">
                EXPERTISE
              </span>
              <span className="bg-[#D7DF21] text-accent-foreground px-6 py-2 rounded-full text-sm font-medium">
                CUSTOMIZATION
              </span>
              <span className="bg-[#D7DF21] text-accent-foreground px-6 py-2 rounded-full text-sm font-medium">
                TRUST
              </span>
            </div>
            
            {/* Description */}
            <h6 className="text-black text-lg md:text-1xl font-light leading-relaxed  ">
              At Concept, we bring over 25 years of experience to every project, 
              delivering expert solutions in real estate and interior design since 1995. Our 
              deep industry knowledge allows us to handle each detail with precision and 
              professionalism. What sets us apart is our commitment to customization, 
              we carefully tailor every design and transaction to meet the unique needs 
              and vision of each client. Above all, we value trust. We build long-term 
              relationships through clear communication, honesty, and reliable service, 
              making your journey with us smooth, transparent, and rewarding.
            </h6>
          </div>
          
          {/* Right side - Professional image with circular background */}
          <div className="relative flex items-center justify-center">
            {/* Bigger circle */}
            <div className="absolute w-[30rem] h-[30rem] bg-[#D7DF21] rounded-full z-0 ml-20"></div>
            {/* Bigger image */}
            <img 
                          src={projectImageURL}
              alt="Professional contractor" 
              className="relative z-10 w-[35rem] h-[35rem] object-cover ml-20 mt-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
