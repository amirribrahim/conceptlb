import teamMember1 from "@/assets/business-office-concept-handsome-buisnessman-01 1.png";
import teamMember2 from "@/assets/business-office-concept-handsome-buisnessman-01 2.png";
import teamMember3 from "@/assets/business-office-concept-handsome-buisnessman-01 3.png";
import teamMember4 from "@/assets/business-office-concept-handsome-buisnessman-01 4.png";

const teamMembers = [
  {
    id: 1,
    name: "FULL NAME",
    position: "POSITION",
    image: teamMember1,
    description: "At [Your Company Name], we believe real estate is more than just buying or selling property — it's about helping people find where life happens."
  },
  {
    id: 2,
    name: "FULL NAME", 
    position: "POSITION",
    image: teamMember2,
    description: "At [Your Company Name], we believe real estate is more than just buying or selling property — it's about helping people find where life happens."
  },
  {
    id: 3,
    name: "FULL NAME",
    position: "POSITION", 
    image: teamMember3,
    description: "At [Your Company Name], we believe real estate is more than just buying or selling property — it's about helping people find where life happens."
  },
  {
    id: 4,
    name: "FULL NAME",
    position: "POSITION",
    image: teamMember4,
    description: "At [Your Company Name], we believe real estate is more than just buying or selling property — it's about helping people find where life happens."
  }
];

export const MeetOurTeam = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16 ">
        <h1 className="text-5xl lg:text-6xl font-semibold text-foreground mb-10">MEET OUR TEAM</h1>
              <p className="text-black text-lg md:text-1xl font-light leading-relaxed  ">
          At CONCEPT , we believe real estate is more than just buying or 
          selling property it's about helping people find where life happens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto ">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center  ">
            {/* Profile Photo with Yellow Circle Background */}
           <div className="relative mb-8 bg-[#D7DF21] rounded-full">
  <div className="w-50 h-50 bg-team-accent rounded-full flex items-center justify-center">
    <div className="w-72 h-72 rounded-full overflow-hidden">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover grayscale mt-10"
      />
    </div>
  </div>
</div>

            
            {/* Member Info Card */}
            <div className="bg-team-card rounded-2xl p-6 w-full max-w-sm text-center p-6 text-center rounded-3xl bg-real-estate-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-[#EDEDED]">
              <h3 className="text-xl font-bold mb-2 text-real-estate-text">
                {member.name}
              </h3>
              <p className="text-sm font-medium mb-4 text-real-estate-text-muted uppercase tracking-wide">
                {member.position}
              </p>
              <p className="text-xs text-real-estate-text-muted leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};