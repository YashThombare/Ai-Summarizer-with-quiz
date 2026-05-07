import { GraduationCap, Briefcase, BookOpen, Microscope } from "lucide-react";
import { ScrollReveal, LineReveal, StaggerContainer, StaggerItem, MagneticHover } from "./ScrollAnimations";

const useCases = [
  { icon: GraduationCap, title: "Students", description: "Summarize lectures, papers, and textbooks. Generate quizzes for exam prep.", color: "text-primary", borderGlow: "hover:glow-primary" },
  { icon: Briefcase, title: "Professionals", description: "Quickly digest reports and articles. Stay informed without the time investment.", color: "text-accent", borderGlow: "hover:glow-accent" },
  { icon: Microscope, title: "Researchers", description: "Process academic papers in seconds. Extract key findings and methodologies.", color: "text-secondary", borderGlow: "hover:glow-secondary" },
  { icon: BookOpen, title: "Content Creators", description: "Repurpose long-form content into concise summaries for any platform.", color: "text-primary", borderGlow: "hover:glow-primary" },
];

const UseCasesSection = () => (
  <section className="relative px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      <div className="text-center mb-14 sm:mb-20">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Who It's For</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mt-4 mb-4">
            Built for <span className="gradient-text-secondary">Everyone</span>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-sm mx-auto mb-5" delay={0.2} direction="center" />
        <ScrollReveal delay={0.3} y={15}>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Whether you're studying, working, or creating — our AI adapts to your needs
          </p>
        </ScrollReveal>
      </div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" staggerDelay={0.08}>
        {useCases.map((uc, i) => (
          <StaggerItem key={i}>
            <MagneticHover>
              <div className={`glass-card-gradient rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full transition-shadow duration-300 ${uc.borderGlow}`}>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="glass-card rounded-xl sm:rounded-2xl p-3 shrink-0">
                    <uc.icon className={`w-6 sm:w-7 h-6 sm:h-7 ${uc.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-2">{uc.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{uc.description}</p>
                  </div>
                </div>
              </div>
            </MagneticHover>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default UseCasesSection;
