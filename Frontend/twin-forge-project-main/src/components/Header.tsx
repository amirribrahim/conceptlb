import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-background">
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-foreground">CONCEPT</span>
        <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
        <span className="text-lg text-muted-foreground">CONTRACTING</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">HOME</a>
        <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">SERVICES</a>
        <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">PROJECTS</a>
        <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">FOR SALE</a>
      </nav>
      
      <Button 
        variant="default" 
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full"
      >
        SIGN UP
      </Button>
    </header>
  );
};

export default Header;