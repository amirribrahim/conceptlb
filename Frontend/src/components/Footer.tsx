import { MapPin, Mail, Phone ,  } from "lucide-react";
import Concept from "../assets/Concept_Logo_Black_April2025-01 2(1)(1).png";
  
import { FaWhatsapp, FaInstagram , FaFacebook} from "react-icons/fa";  

const Footer = () => {

    const baseURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tcn5hrn0h";
    const projectImagePath = "/projects/Main/Concept_Logo_Black_April2025-01 2(1)(1).png";
    const projectImageURL = `${baseURL}${projectImagePath}`;



    // WhatsApp number in international format without plus or spaces:
    const whatsappNumber = "96103002520";
    // Optional default message (URL-encoded)
    const defaultMessage = encodeURIComponent("Hello Concept , I would like to inquire about your services.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <footer className="bg-white px-2 py-12">
      <div className="max-w-7xl mx-auto bg-[#E6E6E6] p-10 rounded-3xl ">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column - Company Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-8">
                          <img src={projectImageURL} alt="Concept Logo" className="max-h-12 w-auto" />
            </div>
            
            {/* Copyright */}
           
            
            {/* Contact Info */}
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D7DF21] rounded-full flex items-center justify-center">
                < Mail className="w-5 h-5 text-foreground" />
                </div>
                    <span className="text-foreground font-medium">ahmed.ibrahim@conceptlb.com </span>
              </div>

      
              
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#D7DF21] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-foreground" />
                </div>
                              <span className="text-foreground font-medium">Choukine Main Street</span>
                
                <span className="text-foreground font-medium"> </span>

              </div>
              
                   <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D7DF21] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                              <span className="text-foreground font-medium">03 00 25 20 </span>
                </div>
             
            </div>
          </div>
          
          {/* Middle Column - Quick Links */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">QUICK LINK</h3>
            <div className="space-y-3">
              <a href="#" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">
                HOME
              </a>
           
              <a href="/Projects" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">
                PROJECTS
              </a>
              <a href="/ForSale" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">
                FOR SALE
              </a>
              <a href="/Contact" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">
                CONTACT US
              </a>
            </div>
          </div>
          
          {/* Right Column - Working Time */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">WORKING TIME</h3>
            <div className="space-y-4">
              <div>
                <p className="text-foreground font-medium">MONDAY - Saturday </p>
                <p className="text-foreground font-medium">8 AM - 5 PM</p>
              </div>
        
              <div className="space-y-3 mt-8">
           <div className="flex items-center space-x-4">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full text-black bg-[#D6DF25] hover:bg-[#D6DF25]/50 transition-all duration-300"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/concept_contracting"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full  text-black bg-[#D6DF25] hover:bg-[#D6DF25]/50 transition-all duration-300"
          >
            <FaInstagram className="h-5 w-5" />
          </a>

     
          </div>
               
                
               
              </div>
            </div>
          </div>
        </div>
        
      </div> <div
          className="py-1 mt-5"
          style={{
            background: "linear-gradient(to right, [#D7DF21], black)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-black font-medium">
  © 2025 CONCEPT. Powered by{" "}
  <a
    href="https://www.instagram.com/upscaleflowai"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    UPSCALEFLOWAI
  </a>
</p>

          </div>
        </div>
           
   
    </footer>

  );
};

export default Footer;