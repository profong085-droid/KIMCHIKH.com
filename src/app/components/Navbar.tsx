import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "GALLERY", path: "/gallery" },
  { label: "NEWS", path: "/news" },
  { label: "SHOP", path: "/shop" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-sm border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="text-2xl md:text-3xl tracking-tighter text-white group-hover:text-red-500 transition-colors duration-300"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                KIMCHI
              </span>
              <span className="text-red-500 text-2xl md:text-3xl tracking-tighter"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                .KH
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-widest transition-colors duration-200 hover:text-red-500 ${
                  location.pathname === link.path ? "text-red-500" : "text-white/80"
                }`}
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#contact"
              className="px-5 py-2 border border-red-500 text-red-500 text-sm tracking-widest hover:bg-red-500 hover:text-white transition-all duration-200"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              CONTACT
            </a>

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* KIMCHI Shop Button */}
            <Link
              to="/shop"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm tracking-widest hover:bg-red-500 transition-all duration-200 group relative"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              title="KIMCHI STORE"
            >
              <ShoppingBag size={15} className="group-hover:scale-110 transition-transform" />
              <span>KIMCHI</span>
              <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[9px] px-1 leading-tight tracking-normal"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                SHOP
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-red-500 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.path}
                  className={`text-4xl tracking-widest transition-colors hover:text-red-500 ${
                    location.pathname === link.path ? "text-red-500" : "text-white"
                  }`}
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              href="#contact"
              className="mt-4 px-8 py-3 border border-red-500 text-red-500 text-2xl tracking-widest"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              CONTACT
            </motion.a>

            {/* Cart - Mobile */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              onClick={() => {
                setCartOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-8 py-3 border border-white/20 text-white text-2xl tracking-widest"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              <ShoppingBag size={22} />
              CART {totalItems > 0 && `(${totalItems})`}
            </motion.button>

            {/* KIMCHI Shop - Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
            >
              <Link
                to="/shop"
                className="flex items-center gap-3 px-8 py-3 bg-red-600 text-white text-2xl tracking-widest"
                style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag size={22} />
                KIMCHI STORE
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}