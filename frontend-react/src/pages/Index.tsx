import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SummarizerInput from "@/components/SummarizerInput";
import SummaryDisplay from "@/components/SummaryDisplay";
import QuizSection, { type QuizQuestion } from "@/components/QuizSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import UseCasesSection from "@/components/UseCasesSection";
import CTASection from "@/components/CTASection";

type InputMode = "text" | "pdf" | "youtube";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { mode: InputMode; content: string; file?: File }) => {
    setIsLoading(true);
    setQuiz(null);
    setSummary(null);
    setError(null);

    try {
      let response: Response;

      if (data.mode === "text") {
        response = await fetch("/summarize/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.content }),
        });
      } else if (data.mode === "youtube") {
        response = await fetch("/summarize/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.content }),
        });
      } else if (data.mode === "pdf" && data.file) {
        const formData = new FormData();
        formData.append("file", data.file);
        response = await fetch("/summarize/pdf", {
          method: "POST",
          body: formData,
        });
      } else {
        throw new Error("Invalid input mode or missing file.");
      }

      const json = await response.json();
      if (!response.ok || json.error) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setSummary(json.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!summary) return;
    setIsGeneratingQuiz(true);
    setError(null);

    try {
      const response = await fetch("/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });

      const json = await response.json();
      if (!response.ok || json.error) {
        throw new Error(json.error || "Failed to generate quiz.");
      }

      const questions: QuizQuestion[] = (json.questions as string[]).map((question) => ({
        question,
      }));
      setQuiz(questions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleRetry = () => {
    setSummary(null);
    setQuiz(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero overflow-x-hidden">
      <Navbar />
      <HeroSection />

      <div className="relative h-16 sm:h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
      </div>

      <SummarizerInput onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card rounded-2xl p-4 border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        </motion.div>
      )}

      {summary && !quiz && (
        <SummaryDisplay summary={summary} onGenerateQuiz={handleGenerateQuiz} isGeneratingQuiz={isGeneratingQuiz} />
      )}
      {quiz && <QuizSection questions={quiz} onRetry={handleRetry} />}

      <div id="features"><FeaturesSection /></div>
      <StatsSection />
      <div id="how-it-works"><HowItWorksSection /></div>
      <div id="use-cases"><UseCasesSection /></div>
      <CTASection />

      <footer className="py-10 sm:py-16 text-center border-t border-border/20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="glass-card rounded-full inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6">
              <span className="text-sm font-medium gradient-text">AI Summery with Qizz</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mb-2">Built with AI • Summarize • Learn • Quiz</p>
            <p className="text-muted-foreground/60 text-xs">© 2024 AI Summery with Qizz. Transforming content into knowledge.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
