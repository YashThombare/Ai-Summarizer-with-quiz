import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./ScrollAnimations";

const stats = [
  { value: "10K+", label: "Summaries Generated", gradient: "gradient-text" },
  { value: "99%", label: "Accuracy Rate", gradient: "gradient-text-accent" },
  { value: "50K+", label: "Quizzes Taken", gradient: "gradient-text-secondary" },
  { value: "3s", label: "Avg. Processing Time", gradient: "gradient-text" },
];

const StatsSection = () => (
  <section className="relative px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
    <div className="max-w-5xl mx-auto">
      <div className="glass-card-strong rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-14 relative overflow-hidden">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" staggerDelay={0.1}>
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <div className="text-center">
                <motion.p
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold font-heading ${stat.gradient} mb-1 sm:mb-2`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: i * 0.08 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  </section>
);

export default StatsSection;
