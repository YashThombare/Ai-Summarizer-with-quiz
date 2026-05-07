import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";
import {
  ScrollReveal,
  LineReveal,
  CharReveal,
} from "./ScrollAnimations";

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-20 -right-20 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-primary/15 blur-3xl will-change-transform"
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/3 -left-16 w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-accent/12 blur-3xl will-change-transform"
      animate={{ y: [0, 12, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute bottom-10 right-1/4 w-40 sm:w-48 h-40 sm:h-48 rounded-full bg-secondary/8 blur-3xl will-change-transform"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>
);

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <motion.section
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 flex items-center justify-center bg-gradient-hero overflow-hidden px-4 sm:px-6"
      style={{ opacity: heroOpacity, scale: heroScale, y: heroY, willChange: "transform, opacity" }}
    >
      <FloatingOrbs />

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
        <ScrollReveal delay={0.2}>
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground/80 tracking-widest uppercase">
              AI-Powered Learning
            </span>
          </div>
        </ScrollReveal>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-[0.95] tracking-tight">
            <CharReveal text="Summarize" className="gradient-text" delay={0.3} />
            <br />
            <motion.span
              className="text-foreground/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              &amp; Quiz
            </motion.span>{" "}
            <CharReveal text="Anything" className="gradient-text-accent" delay={0.8} />
          </h1>
        </div>

        <LineReveal className="max-w-xs sm:max-w-lg mx-auto mb-6 sm:mb-8" delay={1.0} direction="center" />

        <ScrollReveal delay={1.1} y={20}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Drop in text, PDFs, or YouTube links — get{" "}
            <span className="text-foreground font-medium">instant AI summaries</span> and{" "}
            <span className="text-foreground font-medium">auto-generated quizzes</span>.
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="glass-card-strong rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 glow-primary">
            <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-foreground">Smart Summaries</span>
          </div>
          <div className="glass-card-strong rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 glow-accent">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
            <span className="text-xs sm:text-sm font-semibold text-foreground">Instant Quizzes</span>
          </div>
          <div className="glass-card-strong rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 glow-primary">
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-foreground">Multiple Formats</span>
          </div>
        </div>

        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-foreground/20 rounded-full mx-auto flex justify-center pt-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
