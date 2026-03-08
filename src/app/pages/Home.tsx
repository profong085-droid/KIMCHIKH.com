import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Trophy, Gamepad2, Star, ArrowRight } from "lucide-react";
import { Ticker } from "../components/Ticker";
import heroImage from "../../assets/fongrub1.png";
import racingImage from "../../assets/11bbcdbb3ec9526279dafe40432f1e8bb23d7242.png";
import newsImg1 from "../../assets/c89ed7e03ce4c26c18bd3b4b420a9d7db6a31c68.png";
import newsImg2 from "../../assets/090d2875e3b57fc6619d7f157db3a20d459d6293.png";
import newsImg3 from "../../assets/47c55446f509616d9556c636410fbd6237c133a0.png";

const stats = [
  { value: "250+", label: "TOURNAMENTS" },
  { value: "48", label: "CHAMPIONSHIPS" },
  { value: "12M+", label: "FAN FOLLOWERS" },
  { value: "#1", label: "CAMBODIA RANK" },
];

const newsItems = [
  {
    id: 1,
    tag: "TOURNAMENT",
    date: "MAR 2026",
    title: "KIMCHI LEADS DRAGON ESPORTS TO NATIONAL CHAMPIONSHIP VICTORY",
    excerpt: "An incredible performance from the entire squad secured the title in an epic 5-game series.",
    image: newsImg1,
  },
  {
    id: 2,
    tag: "UPDATE",
    date: "FEB 2026",
    title: "NEW SEASON, NEW CHAPTER — KIMCHI ANNOUNCES RETURN FOR SEASON 13",
    excerpt: "After months of preparation, the legendary player is ready to dominate the new competitive season.",
    image: newsImg2,
  },
  {
    id: 3,
    tag: "GAMING",
    date: "JAN 2026",
    title: "TOP GLOBAL ACHIEVEMENT UNLOCKED — KIMCHI HITS #1 WORLDWIDE",
    excerpt: "Breaking records and pushing limits, Phantom reaches the pinnacle of competitive MLBB.",
    image: newsImg3,
  },
];

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Lazy load images with Intersection Observer for better performance
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({
    [heroImage]: true, // Hero image loads first
  });

  useEffect(() => {
    // Preload other images lazily
    const imagesToLoad = [racingImage, newsImg1, newsImg2, newsImg3];
    imagesToLoad.forEach((imgSrc) => {
      if (!loadedImages[imgSrc]) {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [imgSrc]: true }));
        };
      }
    });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden bg-black">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />

        {/* Hero image */}
        <motion.div
          className="absolute inset-0 flex items-end justify-end"
          style={{ y: heroY }}
        >
          <img
            src={heroImage}
            alt="Phantom"
            className="h-full w-auto max-w-none object-cover object-top opacity-80 md:opacity-90"
            style={{ filter: "contrast(1.1) saturate(1.2)" }}
            loading="eager"
          />
        </motion.div>

        {/* Red glow accent */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-600/20 blur-[120px] z-5" />

        {/* Hero content */}
        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-6 pb-20 md:pb-32 w-full"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-red-500 text-xs md:text-sm tracking-[0.4em] mb-3 md:mb-4 uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Dragon Esports · Cambodia
            </p>
            <h1 className="text-[clamp(4rem,15vw,14rem)] leading-none tracking-tighter text-white"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              CHAI<span className="text-red-500">-</span>
              <br />
              FONG
            </h1>
            <p className="text-white/60 text-sm md:text-base tracking-widest mt-4 mb-8 max-w-md uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Professional Mobile Legends Player · Born to Compete
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="px-8 py-3 bg-red-600 text-white text-sm tracking-widest hover:bg-red-500 transition-colors duration-200"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              >
                ABOUT ME
              </Link>
              <Link
                to="/news"
                className="px-8 py-3 border border-white/30 text-white/80 text-sm tracking-widest hover:border-white hover:text-white transition-colors duration-200"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              >
                LATEST NEWS
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/30 text-xs tracking-widest"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>SCROLL</span>
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* STATS */}
      <section className="bg-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center md:px-8"
              >
                <div
                  className="text-5xl md:text-7xl text-red-500 mb-2"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-white/40 text-xs tracking-widest"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED IMAGE SECTION */}
      <section className="relative bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-red-500 text-xs tracking-[0.4em] mb-4 uppercase"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                The Player
              </p>
              <h2 className="text-5xl md:text-7xl text-white mb-6 leading-none"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                BUILT FOR<br />
                <span className="text-red-500">BATTLE</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">
                From the streets of Phnom Penh to the biggest stages in Southeast Asia,
                Phantom has become Cambodia's most feared competitive player. With precision
                mechanics and unmatched game sense, every match is a masterclass.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Trophy, text: "3x National Champion" },
                  { icon: Star, text: "Top Global Rank MLBB" },
                  { icon: Gamepad2, text: "6 Years Pro Experience" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={14} className="text-red-500" />
                    <span className="text-white/60 text-sm tracking-widest"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {text.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-white hover:text-red-500 transition-colors text-sm tracking-widest group"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              >
                READ MORE
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-600/20 blur-[80px] rounded-full" />
              <div className="relative border border-white/10 overflow-hidden bg-white/5">
                {loadedImages[racingImage] ? (
                  <img
                    src={racingImage}
                    alt="Phantom in racing suit"
                    className="w-full h-full object-cover"
                    style={{ filter: "contrast(1.1)" }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-96 bg-white/5 animate-pulse" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-32" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-red-500 text-xs tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    DRAGON ESPORTS
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="bg-black py-20 md:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-red-500 text-xs tracking-[0.4em] mb-3 uppercase"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                Latest
              </p>
              <h2 className="text-5xl md:text-6xl text-white leading-none"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                NEWS & UPDATES
              </h2>
            </div>
            <Link
              to="/news"
              className="hidden md:inline-flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors text-sm tracking-widest group"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              ALL NEWS
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden mb-4 bg-white/5 aspect-[16/9] relative">
                  {loadedImages[item.image] ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-[10px] tracking-widest px-2 py-1"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {item.tag}
                    </span>
                  </div>
                </div>
                <p className="text-white/30 text-xs tracking-widest mb-2"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {item.date}
                </p>
                <h3 className="text-white text-sm md:text-base leading-tight mb-2 group-hover:text-red-400 transition-colors"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.excerpt}</p>
              </motion.article>
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors text-sm tracking-widest"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              ALL NEWS <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-red-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-7xl text-white mb-6 leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              FOLLOW THE JOURNEY
            </h2>
            <p className="text-white/70 text-sm md:text-base tracking-widest mb-8 max-w-lg mx-auto">
              Stay updated with all the latest news, tournament results, and behind-the-scenes content.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm tracking-widest hover:bg-white hover:text-black transition-colors duration-200"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              VIEW GALLERY <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}