import { useState } from "react";
import { FileText, Youtube, Type, Upload, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ScrollReveal,
  LetterSpacingReveal,
  LineReveal,
  ScaleReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from "./ScrollAnimations";

type InputMode = "text" | "pdf" | "youtube";

interface SummarizerInputProps {
  onSubmit: (data: { mode: InputMode; content: string; file?: File }) => void;
  isLoading: boolean;
}

const modes = [
  { id: "text" as InputMode, label: "Text", icon: Type, description: "Paste any text" },
  { id: "pdf" as InputMode, label: "PDF", icon: FileText, description: "Upload a PDF" },
  { id: "youtube" as InputMode, label: "YouTube", icon: Youtube, description: "Paste a link" },
];

const SummarizerInput = ({ onSubmit, isLoading }: SummarizerInputProps) => {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (mode === "text" && text.trim()) onSubmit({ mode, content: text });
    else if (mode === "youtube" && youtubeUrl.trim()) onSubmit({ mode, content: youtubeUrl });
    else if (mode === "pdf" && file) onSubmit({ mode, content: file.name, file });
  };

  const isValid =
    (mode === "text" && text.trim().length > 0) ||
    (mode === "youtube" && youtubeUrl.trim().length > 0) ||
    (mode === "pdf" && file !== null);

  return (
    <section id="summarizer" className="relative px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <ScrollReveal>
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Get Started</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mt-4 mb-4 leading-tight">
            <LetterSpacingReveal className="gradient-text" delay={0.2}>
              SUMMARIZE
            </LetterSpacingReveal>
          </h2>
        </ScrollReveal>
        <LineReveal className="max-w-xs mx-auto mb-5" delay={0.3} direction="center" />
        <ScrollReveal delay={0.4} y={15}>
          <p className="text-muted-foreground text-base sm:text-lg">Choose your input and let AI do the rest</p>
        </ScrollReveal>
      </div>

      <StaggerContainer className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-10" staggerDelay={0.08}>
        {modes.map((m) => (
          <StaggerItem key={m.id}>
            <MagneticHover>
              <button
                onClick={() => setMode(m.id)}
                className={`glass-card rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex flex-col items-center gap-2 transition-all duration-300 ${
                  mode === m.id
                    ? "glass-card-strong glow-primary ring-2 ring-primary/30"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <m.icon className={`w-6 sm:w-7 h-6 sm:h-7 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs sm:text-sm font-semibold ${mode === m.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {m.label}
                </span>
              </button>
            </MagneticHover>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScaleReveal delay={0.2}>
        <div className="glass-card-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden">
          <div className="relative">
            {mode === "text" && (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Textarea
                  placeholder="Paste your text here... articles, notes, essays — anything you want summarized."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[160px] sm:min-h-[200px] bg-background/50 border-border/50 rounded-xl sm:rounded-2xl text-sm sm:text-base resize-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </motion.div>
            )}

            {mode === "youtube" && (
              <motion.div key="youtube" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-3">
                <div className="flex items-center gap-3 p-4 sm:p-5 bg-background/50 rounded-xl sm:rounded-2xl border border-border/50">
                  <Youtube className="w-7 sm:w-8 h-7 sm:h-8 text-accent shrink-0" />
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Paste any YouTube video link to summarize its content
                </p>
              </motion.div>
            )}

            {mode === "pdf" && (
              <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <label className="flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] border-2 border-dashed border-primary/30 rounded-xl sm:rounded-2xl cursor-pointer hover:border-primary/50 transition-colors bg-background/30">
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  {file ? (
                    <div className="flex items-center gap-3 text-foreground">
                      <FileText className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{file.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 sm:gap-3 text-muted-foreground">
                      <Upload className="w-8 sm:w-10 h-8 sm:h-10" />
                      <p className="font-medium text-sm sm:text-base">Click to upload a PDF</p>
                      <p className="text-xs sm:text-sm">Max 20MB</p>
                    </div>
                  )}
                </label>
              </motion.div>
            )}

            <div className="mt-6 sm:mt-8 flex justify-center">
              <MagneticHover>
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className="bg-gradient-primary text-primary-foreground px-8 sm:px-10 py-5 sm:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Summarize Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </MagneticHover>
            </div>
          </div>
        </div>
      </ScaleReveal>
    </section>
  );
};

export default SummarizerInput;
