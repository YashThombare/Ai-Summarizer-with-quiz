import { motion } from "framer-motion";
import { Upload, Cpu, BookOpen, Trophy } from "lucide-react";
import { ScrollReveal, LineReveal, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const steps = [
  { icon: Upload, step: "01", title: "Upload Content", description: "Paste text, upload a PDF, or drop a YouTube link." },
  { icon: Cpu, step: "02", title: "AI Processes", description: "AI analyzes content and extracts the most important information." },
  { icon: BookOpen, step: "03", title: "Get Summary", description: "Receive a clear, structured summary of all critical points." },
  { icon: Trophy, step: "04", title: "Take a Quiz", description: "Generate a quiz to test understanding and reinforce learning." },
];

const HowItWorksSection = () => (
  <section className="relative px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
    <div className="relative max-w-5xl mx-auto">
      <div className="text-center mb-14 sm:mb-20">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Simple Process</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mt-4 mb-4">
            How It <span className="gradient-text-accent">Works</span>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-sm mx-auto mb-5" delay={0.2} direction="center" />
        <ScrollReveal delay={0.3} y={15}>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            From content to comprehension in four simple steps
          </p>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8" staggerDelay={0.1}>
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <div className="glass-card-strong rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 glass-card rounded-full px-3 py-1">
                  <span className="text-xs font-bold gradient-text">{step.step}</span>
                </div>
                <motion.div
                  className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-5 mt-2 sm:mt-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="w-7 sm:w-8 h-7 sm:h-8 text-primary-foreground" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{step.description}</p>
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
