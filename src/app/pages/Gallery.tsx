import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Ticker } from "../components/Ticker";
import heroImage from "../../assets/894b3c7e4f4efc5900fc6571f8fbec4a9aa5fb29.png";
import racingImage from "../../assets/11bbcdbb3ec9526279dafe40432f1e8bb23d7242.png";

const galleryItems = [
  {
    id: 1,
    src: heroImage,
    caption: "KIMCHI — Official Team Photo 2024",
    tag: "PORTRAIT",
    span: "col-span-1 row-span-2",
  },
  {
    id: 2,
    src: racingImage,
    caption: "KIMCHI — Racing Suit Shoot",
    tag: "GEAR",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1759709867209-c3f624df4090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwdG91cm5hbWVudCUyMGFjdGlvbnxlbnwxfHx8fDE3NzI5ODkwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "National Championship Finals 2024",
    tag: "TOURNAMENT",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1556816213-00d1ffaa2f78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwY2hhbXBpb25zaGlwJTIwY3Jvd2QlMjBhcmVuYSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5ODkwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "SEA Esports Arena — Crowd Scene",
    tag: "LIVE EVENT",
    span: "col-span-2 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMFJHQiUyMGRhcmslMjByb29tfGVufDF8fHx8MTc3Mjk0ODQzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Dragon Esports Gaming Station Setup",
    tag: "SETUP",
    span: "col-span-1 row-span-1",
  },
];

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");

  const tags = ["ALL", "PORTRAIT", "GEAR", "TOURNAMENT", "LIVE EVENT", "SETUP"];
  const filtered = filter === "ALL" ? galleryItems : galleryItems.filter((i) => i.tag === filter);

  const selectedItem = selected !== null ? galleryItems.find((i) => i.id === selected) : null;

  const handlePrev = () => {
    if (selected === null) return;
    const idx = galleryItems.findIndex((i) => i.id === selected);
    const prev = (idx - 1 + galleryItems.length) % galleryItems.length;
    setSelected(galleryItems[prev].id);
  };

  const handleNext = () => {
    if (selected === null) return;
    const idx = galleryItems.findIndex((i) => i.id === selected);
    const next = (idx + 1) % galleryItems.length;
    setSelected(galleryItems[next].id);
  };

  return (
    <div className="bg-black">
      {/* PAGE HERO */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Gallery Hero"
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40" />
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-red-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-500 text-xs tracking-[0.4em] mb-3 uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Visual Archive
            </p>
            <h1 className="text-6xl md:text-9xl text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              GALLERY
            </h1>
          </motion.div>
        </div>
      </section>

      <Ticker />

      {/* FILTER */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-wrap gap-3">
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
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[240px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`${item.span} relative overflow-hidden cursor-pointer group bg-white/5 border border-white/10`}
                onClick={() => setSelected(item.id)}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-red-500 text-[10px] tracking-widest block mb-1"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {item.tag}
                  </span>
                  <p className="text-white text-xs tracking-wide"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setSelected(null)}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-white/60 hover:text-red-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-4 md:right-8 text-white/60 hover:text-red-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={selectedItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.src}
                alt={selectedItem.caption}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-white/60 text-sm tracking-widest"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {selectedItem.caption}
                </p>
                <span className="text-red-500 text-xs tracking-widest"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {selectedItem.tag}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
