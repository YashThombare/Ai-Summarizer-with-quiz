import { Copy, Check, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollReveal, LineReveal, LetterSpacingReveal, MagneticHover } from "./ScrollAnimations";

interface SummaryDisplayProps {
  summary: string;
  onGenerateQuiz: () => void;
  isGeneratingQuiz: boolean;
}

const SummaryDisplay = ({ summary, onGenerateQuiz, isGeneratingQuiz }: SummaryDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Results</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mt-4 mb-4">
            <LetterSpacingReveal className="gradient-text" delay={0.15}>
              SUMMARY
            </LetterSpacingReveal>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-xs mx-auto" delay={0.3} direction="center" />
      </div>

      <motion.div
        className="glass-card-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative">
          {summary.split("\n").map((line, i) => (
            <motion.p
              key={i}
              className="text-foreground/90 leading-relaxed text-sm sm:text-base mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
            >
              {line || <br />}
            </motion.p>
          ))}

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy summary"}
            </button>

            <MagneticHover>
              <Button
                onClick={onGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="bg-gradient-accent text-accent-foreground px-6 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Generate Quiz
              </Button>
            </MagneticHover>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default SummaryDisplay;
