const StatsSection = () => {
  return (
    <section className="px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-light-gray rounded-3xl px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Happy Clients */}
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">+500</div>
              <div className="text-sm font-semibold text-muted-foreground tracking-wide">
                HAPPY CLIENT
              </div>
            </div>
            
            {/* Years in field */}
            <div>
              <div className="text-sm font-semibold text-muted-foreground tracking-wide mb-2">
                SINCE
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">1995</div>
              <div className="text-sm font-semibold text-muted-foreground tracking-wide">
                IN THE FIELD
              </div>
            </div>
            
            {/* Projects */}
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">+300</div>
              <div className="text-sm font-semibold text-muted-foreground tracking-wide">
                EXTERIOR PROJECTS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;