import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";

export default function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const isNegative = stat.change.startsWith("-");
  const { count } = useCountUp(stat.value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6 hover:scale-105 hover-glow group transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-primary/80 mb-1 group-hover:text-primary transition-colors">
            {stat.name}
          </p>
          <p className="text-3xl font-bold text-text-primary mt-1 tabular-nums">
            {count.toLocaleString()}
          </p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`text-sm mt-2 font-medium flex items-center gap-1 ${
              isNegative ? "text-medical-success" : "text-medical-secondary"
            }`}
          >
            <span className="inline-block animate-bounce-subtle">
              {isNegative ? "↓" : "↑"}
            </span>
            {stat.change}
          </motion.p>
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`p-4 rounded-2xl shadow-lg ${
            stat.color === "primary"
              ? "bg-gradient-to-br from-medical-primary/20 to-medical-primary/10"
              : stat.color === "secondary"
              ? "bg-gradient-to-br from-medical-secondary/20 to-medical-secondary/10"
              : stat.color === "accent"
              ? "bg-gradient-to-br from-medical-accent/20 to-medical-accent/10"
              : "bg-gradient-to-br from-medical-error/20 to-medical-error/10"
          }`}
        >
          <Icon
            className={`w-7 h-7 ${
              stat.color === "primary"
                ? "text-medical-primary"
                : stat.color === "secondary"
                ? "text-medical-secondary"
                : stat.color === "accent"
                ? "text-medical-accent"
                : "text-medical-error"
            }`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
