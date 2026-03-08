import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { BackgroundMusic } from "./components/BackgroundMusic";

export function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <BackgroundMusic />
      </div>
    </CartProvider>
  );
}
