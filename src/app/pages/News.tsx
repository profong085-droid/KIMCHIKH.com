import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Ticker } from "../components/Ticker";
import racingImage from "../../assets/11bbcdbb3ec9526279dafe40432f1e8bb23d7242.png";

const allNews = [
  {
    id: 1,
    tag: "TOURNAMENT",
    date: "MARCH 5, 2026",
    title: "KIMCHI LEADS DRAGON ESPORTS TO NATIONAL CHAMPIONSHIP VICTORY",
    excerpt:
      "An incredible performance from the entire squad secured the title in an epic 5-game series against the defending champions. Phantom's MVP performance in Game 5 will go down in MLBB history.",
    image: "https://images.unsplash.com/photo-1759709867209-c3f624df4090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwdG91cm5hbWVudCUyMGFjdGlvbnxlbnwxfHx8fDE3NzI5ODkwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
  },
  {
    id: 2,
    tag: "UPDATE",
    date: "FEBRUARY 18, 2026",
    title: "NEW SEASON, NEW CHAPTER — KIMCHI ANNOUNCES RETURN FOR SEASON 13",
    excerpt:
      "After months of preparation, training, and strategizing with the Dragon Esports coaching staff, the legendary player is ready to dominate the new competitive season.",
    image: "https://images.unsplash.com/photo-1556816213-00d1ffaa2f78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwY2hhbXBpb25zaGlwJTIwY3Jvd2QlMjBhcmVuYSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5ODkwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
  {
    id: 3,
    tag: "GAMING",
    date: "JANUARY 30, 2026",
    title: "TOP GLOBAL ACHIEVEMENT UNLOCKED — KIMCHI HITS #1 WORLDWIDE",
    excerpt:
      "Breaking records and pushing the limits of competitive play, Phantom has reached the absolute pinnacle of Mobile Legends: Bang Bang's global ranking system.",
    image: "https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMFJHQiUyMGRhcmslMjByb29tfGVufDF8fHx8MTc3Mjk0ODQzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
  {
    id: 4,
    tag: "SPONSORSHIP",
    date: "JANUARY 15, 2026",
    title: "KIMCHI JOINS FORCES WITH LEADING GAMING PERIPHERALS BRAND",
    excerpt:
      "A major partnership announcement that will see Phantom collaborate on a signature line of gaming gear designed for maximum performance.",
    image: "https://images.unsplash.com/photo-1759709867209-c3f624df4090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwdG91cm5hbWVudCUyMGFjdGlvbnxlbnwxfHx8fDE3NzI5ODkwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
  {
    id: 5,
    tag: "COMMUNITY",
    date: "DECEMBER 20, 2025",
    title: "KIMCHI HOSTS CAMBODIA'S LARGEST GAMING BOOTCAMP FOR YOUTH PLAYERS",
    excerpt:
      "Over 500 aspiring players gathered in Phnom Penh for an intensive two-day training camp led by Phantom and the Dragon Esports coaching team.",
    image: "https://images.unsplash.com/photo-1556816213-00d1ffaa2f78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwY2hhbXBpb25zaGlwJTIwY3Jvd2QlMjBhcmVuYSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5ODkwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
];

const tags = ["ALL", "TOURNAMENT", "UPDATE", "GAMING", "SPONSORSHIP", "COMMUNITY"];

export function News() {
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? allNews : allNews.filter((n) => n.tag === filter);
  const featured = allNews.find((n) => n.featured);
  const rest = filtered.filter((n) => !n.featured || filter !== "ALL");

  return (
    <div className="bg-black">
      {/* PAGE HERO */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={racingImage}
            alt="News Hero"
            className="w-full h-full object-cover object-top opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        </div>
        <div className="absolute left-0 bottom-0 w-1/2 h-full bg-red-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-500 text-xs tracking-[0.4em] mb-3 uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Updates
            </p>
            <h1 className="text-6xl md:text-9xl text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              NEWS &<br />
              <span className="text-red-500">UPDATES</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <Ticker bgColor="bg-red-600" />

      {/* FEATURED */}
      {filter === "ALL" && featured && (
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 hover:border-red-600/50 transition-colors"
          >
            <div className="relative overflow-hidden aspect-video md:aspect-auto">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:to-black" />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white text-[10px] tracking-widest px-3 py-1"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  FEATURED
                </span>
              </div>
            </div>
            <div className="bg-white/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-red-500 text-[10px] tracking-widest border border-red-600/40 px-2 py-1"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {featured.tag}
                </span>
                <span className="text-white/30 text-[10px] tracking-widest"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {featured.date}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl text-white mb-4 leading-tight group-hover:text-red-400 transition-colors"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                {featured.title}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="inline-flex items-center gap-2 text-red-500 text-sm tracking-widest group/link"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                READ FULL STORY
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* FILTER + GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-10">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 text-xs tracking-widest transition-all duration-200 ${
                filter === tag
                  ? "bg-red-600 text-white"
                  : "border border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group cursor-pointer border border-white/10 hover:border-red-600/40 transition-colors"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-red-600 text-white text-[10px] tracking-widest px-2 py-1"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-white/30 text-[10px] tracking-widest mb-2"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {item.date}
                </p>
                <h3 className="text-white text-sm md:text-base leading-snug mb-2 group-hover:text-red-400 transition-colors"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-white/30 text-[10px] tracking-widest group-hover:text-red-500 transition-colors"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  READ MORE <ArrowRight size={10} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* BOTTOM SPACER */}
      <div className="pb-16" />
    </div>
  );
}
