import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div
          className="text-[12rem] leading-none text-white/5 select-none"
          style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
        >
          404
        </div>
        <div className="-mt-16">
          <h1 className="text-5xl md:text-7xl text-white mb-4"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
            PAGE NOT<br /><span className="text-red-500">FOUND</span>
          </h1>
          <p className="text-white/40 text-sm tracking-widest mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white text-sm tracking-widest hover:bg-red-500 transition-colors"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
          >
            GO HOME <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
