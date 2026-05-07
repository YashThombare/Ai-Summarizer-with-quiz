import { Brain, FileText, Youtube, Zap, Shield, Clock } from "lucide-react";
import { ScrollReveal, LineReveal, StaggerContainer, StaggerItem, MagneticHover } from "./ScrollAnimations";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Summaries",
    description: "Advanced language models extract the most important information from any content.",
    gradient: "from-primary to-accent",
    glow: "glow-primary",
  },
  {
    icon: FileText,
    title: "PDF Document Support",
    description: "Upload any PDF and get an instant breakdown of key points and conclusions.",
    gradient: "from-secondary to-primary",
    glow: "glow-secondary",
  },
  {
    icon: Youtube,
    title: "YouTube Video Analysis",
    description: "Paste a YouTube link and receive a complete summary without watching the video.",
    gradient: "from-accent to-primary",
    glow: "glow-accent",
  },
  {
    icon: Zap,
    title: "Instant Quiz Generation",
    description: "Auto-generate interactive quizzes from summaries to test comprehension.",
    gradient: "from-primary to-secondary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Accurate & Reliable",
    description: "High accuracy through cross-referencing and source-backed summaries.",
    gradient: "from-secondary to-accent",
    glow: "glow-secondary",
  },
  {
    icon: Clock,
    title: "Save Hours of Time",
    description: "Summarize 30-minute reads in seconds. Perfect for students and professionals.",
    gradient: "from-accent to-secondary",
    glow: "glow-accent",
  },
];

const FeaturesSection = () => (
  <section className="relative px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      <div className="text-center mb-14 sm:mb-20">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Why Choose Us</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mt-4 mb-4 leading-tight">
            Powerful <span className="gradient-text">Features</span>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-sm mx-auto mb-5" delay={0.2} direction="center" />
        <ScrollReveal delay={0.3} y={15}>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
            Everything you need to transform lengthy content into digestible knowledge.
          </p>
        </ScrollReveal>
      </div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.08}>
        {features.map((feature, i) => (
          <StaggerItem key={i}>
            <MagneticHover>
              <div className="glass-card-gradient rounded-2xl sm:rounded-3xl p-5 sm:p-7 h-full group cursor-default">
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-5 ${feature.glow} group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </MagneticHover>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default FeaturesSection;
