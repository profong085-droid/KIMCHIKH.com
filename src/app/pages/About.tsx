import { motion } from "motion/react";
import { Ticker } from "../components/Ticker";
import heroImage from "../../assets/894b3c7e4f4efc5900fc6571f8fbec4a9aa5fb29.png";
import racingImage from "../../assets/11bbcdbb3ec9526279dafe40432f1e8bb23d7242.png";

const timeline = [
  { year: "2018", event: "Started competitive Mobile Legends: Bang Bang" },
  { year: "2019", event: "Joined Dragon Esports as a rising talent" },
  { year: "2020", event: "Won first National Championship title" },
  { year: "2021", event: "Represented Cambodia in SEA Games Qualifiers" },
  { year: "2022", event: "Back-to-back championship win — MVP awarded" },
  { year: "2023", event: "Reached Top Global rank worldwide" },
  { year: "2024", event: "Third National Championship — legend status cemented" },
  { year: "2025", event: "Brand ambassador partnerships announced" },
  { year: "2026", event: "Season 13 campaign begins" },
];

const skills = [
  { name: "MECHANICS", value: 98 },
  { name: "GAME SENSE", value: 95 },
  { name: "TEAMWORK", value: 92 },
  { name: "LEADERSHIP", value: 88 },
  { name: "ADAPTABILITY", value: 94 },
];

export function About() {
  return (
    <div className="bg-black">
      {/* PAGE HERO */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={racingImage}
            alt="Phantom"
            className="w-full h-full object-cover object-top opacity-40"
            style={{ filter: "contrast(1.1) saturate(0.8)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        {/* Red glow */}
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-red-600/15 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-500 text-xs tracking-[0.4em] mb-3 uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              The Story
            </p>
            <h1 className="text-6xl md:text-9xl text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              ABOUT<br />
              <span className="text-red-500">KIMCHI</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <Ticker bgColor="bg-red-600" />

      {/* BIO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/10 blur-2xl" />
              <div className="relative border border-white/10 overflow-hidden">
                <img
                  src={heroImage}
                  alt="Phantom portrait"
                  className="w-full h-auto object-cover"
                  style={{ filter: "contrast(1.1) saturate(1.1)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20" />
              </div>
            </div>

            {/* Quick facts */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "REAL NAME", value: "SOKHA" },
                { label: "NICKNAME", value: "KIMCHI" },
                { label: "NATIONALITY", value: "CAMBODIAN" },
                { label: "TEAM", value: "DRAGON ESPORTS" },
                { label: "ROLE", value: "MARKSMAN / MAGE" },
                { label: "STATUS", value: "ACTIVE" },
              ].map((fact) => (
                <div key={fact.label} className="border border-white/10 p-3">
                  <p className="text-white/30 text-[10px] tracking-widest mb-1"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {fact.label}
                  </p>
                  <p className="text-white text-sm tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-6xl text-white mb-6 leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              THE LEGEND<br />
              <span className="text-red-500">FROM CAMBODIA</span>
            </h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed">
              <p>
                Born and raised in Phnom Penh, Phantom discovered his passion for competitive
                gaming at the age of 15. What started as a hobby quickly evolved into a calling —
                a relentless pursuit of excellence in Mobile Legends: Bang Bang.
              </p>
              <p>
                Under the banner of Dragon Esports, Phantom has become the most decorated
                Cambodian player in MLBB history. Known for his razor-sharp mechanics and
                ability to perform under pressure, he has inspired a new generation of
                Cambodian gamers to dream bigger.
              </p>
              <p>
                Off the screen, Phantom is known for his discipline, work ethic, and
                commitment to elevating the esports scene in Southeast Asia. He regularly
                hosts training camps and mentors upcoming talents.
              </p>
              <p>
                With three national championships, a Top Global rank, and a passionate
                fanbase of over 12 million, Phantom's story is far from over.
                Season 13 is just the beginning.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-10">
              <h3 className="text-white text-xl mb-6 tracking-widest"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                PLAYER STATS
              </h3>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60 text-xs tracking-widest"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        {skill.name}
                      </span>
                      <span className="text-red-500 text-xs"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        {skill.value}
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-600 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-black border-t border-white/10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-red-500 text-xs tracking-[0.4em] mb-3"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              CAREER JOURNEY
            </p>
            <h2 className="text-5xl md:text-7xl text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              THE TIMELINE
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`relative flex items-center gap-8 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"} pl-8 md:pl-0`}>
                    <div className="text-red-500 text-3xl mb-1"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {item.year}
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs ml-auto">{item.event}</p>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-red-600 border-2 border-black rounded-full -translate-x-1/2 md:-translate-x-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
