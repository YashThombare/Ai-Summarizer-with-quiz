import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal, MagneticHover } from "./ScrollAnimations";

const CTASection = () => {
  const scrollToTop = () => {
    document.getElementById("summarizer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card-strong rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-primary/8 blur-3xl will-change-transform"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-accent/8 blur-3xl will-change-transform"
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="relative">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-8">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground/80">Ready to start?</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-5 sm:mb-6 leading-tight">
                Transform Content <br className="hidden sm:block" />
                <span className="gradient-text">Into Knowledge</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2} y={15}>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 px-2">
                Stop wasting time on lengthy content. Let AI do the heavy lifting.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <MagneticHover>
                <Button
                  onClick={scrollToTop}
                  className="bg-gradient-primary text-primary-foreground px-8 sm:px-10 py-5 sm:py-7 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <ArrowUp className="w-5 h-5 mr-2" />
                  Start Summarizing
                </Button>
              </MagneticHover>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
