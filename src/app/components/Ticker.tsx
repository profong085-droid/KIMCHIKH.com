import { motion } from "motion/react";

const items = [
  "DRAGON ESPORTS",
  "MOBILE LEGENDS",
  "MVP 2024",
  "CAMBODIA CHAMPION",
  "KIMCHI",
  "SEASON 12",
  "TOP GLOBAL",
  "MLBB PRO",
  "DRAGON ESPORTS",
  "MOBILE LEGENDS",
  "MVP 2024",
  "CAMBODIA CHAMPION",
  "KIMCHI",
  "SEASON 12",
  "TOP GLOBAL",
  "MLBB PRO",
];

interface TickerProps {
  direction?: "left" | "right";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

export function Ticker({
  direction = "left",
  bgColor = "bg-red-600",
  textColor = "text-white",
  borderColor = "border-red-800",
}: TickerProps) {
  return (
    <div className={`${bgColor} ${borderColor} border-y py-3 overflow-hidden relative`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`${textColor} text-sm tracking-widest inline-flex items-center gap-6`}
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
          >
            {item}
            <span className="text-white/40 text-xs">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
