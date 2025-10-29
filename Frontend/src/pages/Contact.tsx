import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { MeetOurTeam } from "@/components/MeetOurTeam"; 

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ContactSection />
      <Footer /> 
    </div>
  );
};

export default Contact;
