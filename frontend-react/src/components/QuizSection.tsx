import { useState } from "react";
import { RotateCcw, Trophy, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollReveal, LineReveal, LetterSpacingReveal, MagneticHover } from "./ScrollAnimations";

export interface QuizQuestion {
  question: string;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onRetry: () => void;
}

const QuizSection = ({ questions, onRetry }: QuizSectionProps) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(safeQuestions.length).fill(""));
  const [finished, setFinished] = useState(false);

  if (safeQuestions.length === 0) {
    return (
      <div className="text-center p-8 text-destructive">
        <p>No valid questions were received. Please try again.</p>
        <Button onClick={onRetry} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const question = safeQuestions[currentQ];

  const handleAnswerChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQ] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1);
    }
  };

  if (finished) {
    const answeredCount = answers.filter((answer) => answer.trim().length > 0).length;
    return (
      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
        <motion.div
          className="glass-card-strong rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
              <Trophy className="w-16 sm:w-20 h-16 sm:h-20 text-accent mx-auto mb-4 sm:mb-5" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3">Quiz Complete!</h2>
            <motion.p
              className="text-5xl sm:text-6xl font-bold gradient-text mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {answeredCount}/{questions.length}
            </motion.p>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              Questions answered. Review your answers below.
            </p>

            <div className="text-left space-y-4 mb-8">
              {questions.map((currentQuestion, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Q{index + 1}</p>
                  <p className="text-sm font-semibold text-foreground mb-2">{currentQuestion.question}</p>
                  <p className="text-sm text-foreground/70 italic">
                    {answers[index]?.trim() || <span className="text-muted-foreground">No answer provided</span>}
                  </p>
                </motion.div>
              ))}
            </div>

            <MagneticHover>
              <Button onClick={onRetry} className="bg-gradient-primary text-primary-foreground px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold">
                <RotateCcw className="w-5 h-5 mr-2" />
                Start Over
              </Button>
            </MagneticHover>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Test Yourself</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mt-4 mb-4">
            <LetterSpacingReveal className="gradient-text-accent" delay={0.15}>
              QUIZ
            </LetterSpacingReveal>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-xs mx-auto mb-4" delay={0.3} direction="center" />
        <ScrollReveal delay={0.4} y={10}>
          <p className="text-muted-foreground text-sm sm:text-base">
            Question {currentQ + 1} of {questions.length}
          </p>
        </ScrollReveal>
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="glass-card-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-base sm:text-lg font-semibold text-foreground mb-5 sm:mb-7">{question.question}</p>

          <textarea
            value={answers[currentQ]}
            onChange={(event) => handleAnswerChange(event.target.value)}
            placeholder="Type your answer here..."
            rows={5}
            className="w-full rounded-xl sm:rounded-2xl bg-background/50 border border-border/50 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />

          <div className="mt-5 sm:mt-7 flex items-center justify-between gap-3">
            <MagneticHover>
              <Button
                onClick={handlePrev}
                disabled={currentQ === 0}
                variant="ghost"
                className="rounded-xl sm:rounded-2xl px-4 py-4 sm:py-5 font-semibold disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Prev
              </Button>
            </MagneticHover>

            <MagneticHover>
              <Button onClick={handleNext} className="bg-gradient-primary text-primary-foreground px-6 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold">
                {currentQ < questions.length - 1 ? "Next" : "Finish Quiz"}
                {currentQ < questions.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
              </Button>
            </MagneticHover>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default QuizSection;
