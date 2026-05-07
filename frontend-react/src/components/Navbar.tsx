import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";

const navItems = [
  { label: "Summarize", id: "summarizer" },
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Use Cases", id: "use-cases" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 glass-card-strong rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-4 sm:gap-6 max-w-[95vw]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-2 mr-2 sm:mr-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
          </div>
          <span className="font-bold font-heading text-foreground text-sm">AI Summery with Qizz</span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-muted-foreground hover:text-foreground font-medium px-3 py-1.5 rounded-full hover:bg-foreground/5 transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="sm:hidden p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 glass-card-strong rounded-2xl p-4 flex flex-col gap-2 min-w-[200px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
