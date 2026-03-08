import { Link } from "react-router";
import { Instagram, Youtube, Facebook, Twitter, Music, Send } from "lucide-react";
import { Ticker } from "./Ticker";

const socials = [
  { 
    icon: Facebook, 
    label: "Facebook", 
    href: "https://web.facebook.com/Bongfong088",
    target: "_blank"
  },
  { 
    icon: Music, 
    label: "TikTok", 
    href: "https://www.tiktok.com/@ceyjomesprocute?lang=km-KH",
    target: "_blank"
  },
  { 
    icon: Send, 
    label: "Telegram", 
    href: "https://t.me/meOnlyFong",
    target: "_blank"
  },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
];

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Gallery", path: "/gallery" },
  { label: "News", path: "/news" },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <Ticker bgColor="bg-black" textColor="text-white/60" borderColor="border-white/10" direction="right" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="text-4xl tracking-tighter text-white"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                KIMCHI
              </span>
              <span className="text-red-500 text-4xl tracking-tighter"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                .KH
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Professional esports player from Cambodia. Dragon Esports team member.
              Mobile Legends: Bang Bang competitor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/50 text-xs tracking-widest mb-4 uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-red-500 transition-colors text-sm tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div id="contact">
            <h4 className="text-white/50 text-xs tracking-widest mb-4 uppercase">Follow Me</h4>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, label, href, target }) => (
                <a
                  key={label}
                  href={href}
                  target={target}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-red-500 hover:text-red-500 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-widest">
            © 2026 KIMCHI.KH — ALL RIGHTS RESERVED
          </p>
          <p className="text-white/20 text-xs">
            DRAGON ESPORTS · CAMBODIA
          </p>
        </div>
      </div>
    </footer>
  );
}
