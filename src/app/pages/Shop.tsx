import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, ArrowRight, Filter, Plus, Zap } from "lucide-react";
import { Ticker } from "../components/Ticker";
import {useCart } from "../context/CartContext";
import {PaymentPopup} from "../components/PaymentPopup";
import goods1Img from "../../assets/Goods1.jpg";
import goods2Img from "../../assets/Goods2.jpg";
import goods3Img from "../../assets/Goods3.jpg";
import goods4Img from "../../assets/Goods4.jpg";
import goods5Img from "../../assets/Goods5.jpg";
import goods6Img from "../../assets/Goods6.jpg";
import goods7Img from "../../assets/Goods7.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  description?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "GOODS1 PREMIUM JERSEY",
    price: 18.99,
    category: "JERSEYS",
    image: goods1Img,
    tag: "BESTSELLER",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", hex: "#DC2626" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Premium quality jersey with moisture-wicking technology and professional design.",
  },
  {
    id: 2,
    name: "GOODS2 ELITE HOODIE",
    price: 18.99,
    category: "HOODIES",
    image: goods2Img,
    tag: "NEW",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Gray", hex: "#6B7280" },
      { name: "Navy", hex: "#1E3A8A" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Elite comfort hoodie with premium materials and modern fit.",
  },
  {
    id: 3,
    name: "GOODS3 CLASSIC CAP",
    price: 18.99,
    category: "ACCESSORIES",
    image: goods3Img,
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1E3A8A" }
    ],
    description: "Classic adjustable cap with embroidered logo and comfortable fit.",
  },
  {
    id: 4,
    name: "GOODS4 PRO JACKET",
    price: 18.99,
    category: "JACKETS",
    image: goods4Img,
    tag: "PREMIUM",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Navy", hex: "#1E3A8A" }
    ],
    description: "Professional grade jacket with weather resistance and sleek design.",
  },
  {
    id: 5,
    name: "GOODS5 ESSENTIAL TEE",
    price: 18.99,
    category: "T-SHIRTS",
    image: goods5Img,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#6B7280" },
      { name: "Navy", hex: "#1E3A8A" }
    ],
    description: "Essential everyday t-shirt in premium cotton blend with perfect fit.",
  },
  {
    id: 6,
    name: "GOODS6 SPORT PANTS",
    price: 18.99,
    category: "PANTS",
    image: goods6Img,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Navy", hex: "#1E3A8A" }
    ],
    description: "High-performance sport pants with flexible fabric and comfortable waistband.",
  },
  {
    id: 7,
    name: "GOODS7 SIGNATURE SHIRT",
    price: 18.99,
    category: "SHIRTS",
    image: goods7Img,
    tag: "LIMITED",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Pink", hex: "#FFC0CB" }
    ],
    description: "Signature collection shirt with premium fabric and exclusive design.",
  },
];

const categories = ["ALL", "JERSEYS", "HOODIES", "T-SHIRTS", "JACKETS", "PANTS", "ACCESSORIES", "SHIRTS"];

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showBuyNowPopup, setShowBuyNowPopup] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  
  // Lazy loading state for better performance
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Preload images lazily to improve initial load time
    const productImages = products.map(p => p.image);
    productImages.forEach((imgSrc, index) => {
      setTimeout(() => {
        if (!loadedImages[imgSrc]) {
          const img = new Image();
          img.src = imgSrc;
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [imgSrc]: true }));
          };
        }
      }, index * 100); // Stagger loading to avoid blocking
    });
  }, []);

  const filteredProducts = selectedCategory === "ALL" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleQuickView = (product: Product) => {
   setSelectedProduct(product);
   setSelectedSize(product.sizes?.[0] || "");
   setSelectedColor(product.colors?.[0]?.name || "");
   setQuantity(1);
  };

  const handleBuyNow = (product: Product) => {
   setBuyNowProduct(product);
   setShowBuyNowPopup(true);
  };

  const handlePaymentConfirm = () => {
    // Add product to cart and proceed with checkout
  if (buyNowProduct) {
    addToCart({
    id: buyNowProduct.id,
     name: buyNowProduct.name,
     price: buyNowProduct.price,
      image: buyNowProduct.image,
     });
    }
   setShowBuyNowPopup(false);
    // TODO: Redirect to checkout or show success page
  };

  const handleAddToCart = (e?: React.MouseEvent, product?: Product, fromModal: boolean = false) => {
    if (fromModal && selectedProduct) {
      if (!selectedSize) {
        alert("Please select a size");
        return;
      }
      addToCart({
        id: selectedProduct.id,
        name: `${selectedProduct.name} - Size: ${selectedSize}, Color: ${selectedColor}`,
        price: selectedProduct.price,
        image: selectedProduct.image,
      });
      setAddedToCart(selectedProduct.id);
      setTimeout(() => setAddedToCart(null), 2000);
      setSelectedProduct(null);
    } else if (e && product) {
      e.stopPropagation();
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 1000);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-black to-black z-0" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-red-600/10 blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-500 text-xs tracking-[0.4em] mb-3 uppercase"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              KIMCHI STORE
            </p>
            <h1 className="text-6xl md:text-8xl text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              OFFICIAL<br />
              <span className="text-red-500">MERCHANDISE</span>
            </h1>
            <p className="text-white/60 text-sm tracking-widest mt-4 max-w-md"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              PREMIUM CLOTHING & ACCESSORIES · DRAGON ESPORTS COLLECTION
            </p>
          </motion.div>
        </div>
      </section>

      <Ticker />

      {/* CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <Filter size={16} className="text-red-500" />
          <span className="text-white/40 text-xs tracking-widest"
            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
            FILTER BY CATEGORY
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs tracking-widest transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "border border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden bg-white/5 border border-white/10 aspect-[3/4]">
                  {loadedImages[product.image] ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 animate-pulse" />
                  )}
                  
                  {/* Quick View Button */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleQuickView(product)}
                      className="px-6 py-2 bg-white text-black text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      QUICK VIEW
                    </button>
                  </div>

                  {/* Tag Badge */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-red-600 text-white text-[10px] tracking-widest px-2 py-1"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* Available Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-green-600 text-white text-[9px] tracking-widest px-2 py-1"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      AVAILABLE
                    </span>
                  </div>

                  {/* Buy Now Button - Always Visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product);
                       }}
                      disabled={addedToCart === product.id}
                      className={`w-full py-3 text-white text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        addedToCart === product.id
                          ? 'bg-green-600 cursor-default'
                          : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                      }`}
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {addedToCart === product.id ? (
                        <>
                          <span>✓</span>
                          <span>ADDED!</span>
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          <span>BUY NOW</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="pt-4">
                  <p className="text-white/30 text-xs tracking-widest mb-1"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {product.category}
                  </p>
                  <h3 className="text-white text-sm tracking-wide mb-2 group-hover:text-red-400 transition-colors"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    {product.name}
                  </h3>
                  <p className="text-red-500 text-base tracking-widest mb-2"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-green-500 text-[10px] tracking-widest uppercase"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    ✓ Available for Purchase
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* FEATURED BANNER */}
      <section className="relative bg-red-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556816213-00d1ffaa2f78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwY2hhbXBpb25zaGlwJTIwY3Jvd2QlMjBhcmVuYSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5ODkwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-7xl text-white mb-6 leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              JOIN THE LEGEND
            </h2>
            <p className="text-white/70 text-sm md:text-base tracking-widest mb-8 max-w-lg mx-auto">
              Wear the same gear as the champions. Official Dragon Esports merchandise worn by Phantom and the team.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm tracking-widest hover:bg-white hover:text-black transition-colors duration-200"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              VIEW ALL PRODUCTS <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="bg-black py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "FREE SHIPPING", desc: "On orders over $100 worldwide" },
              { title: "AUTHENTIC MERCH", desc: "Official Dragon Esports licensed products" },
              { title: "SECURE PAYMENT", desc: "Encrypted transactions via KIMCHI" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-white text-sm tracking-widest mb-2"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative aspect-square">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white text-xs tracking-widest px-3 py-1"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        {selectedProduct.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info & Options */}
                <div className="p-8 flex flex-col gap-6">
                  <div>
                    <p className="text-red-500 text-xs tracking-widest mb-2"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {selectedProduct.category}
                    </p>
                    <h2 className="text-3xl text-white leading-tight mb-3"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      {selectedProduct.name}
                    </h2>
                    <p className="text-white/60 text-sm">{selectedProduct.description}</p>
                    <p className="text-2xl text-red-500 mt-3 font-bold"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      ${selectedProduct.price}
                    </p>
                  </div>

                  {/* Size Selection */}
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <label className="text-white/80 text-xs tracking-widest block mb-3"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        SELECT SIZE
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-sm transition-all ${
                              selectedSize === size
                                ? "bg-red-600 text-white"
                                : "border border-white/20 text-white/60 hover:border-white/50"
                            }`}
                            style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <label className="text-white/80 text-xs tracking-widest block mb-3"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        SELECT COLOR
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`group relative flex flex-col items-center gap-2 ${
                              selectedColor === color.name ? "opacity-100" : "opacity-50 hover:opacity-75"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full border-2 transition-all ${
                                selectedColor === color.name ? "border-white scale-110" : "border-transparent"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                            <span className="text-white/60 text-xs">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div>
                    <label className="text-white/80 text-xs tracking-widest block mb-3"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      QUANTITY
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-all"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-xl text-white"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(undefined, undefined, true)}
                    disabled={addedToCart === selectedProduct.id}
                    className={`w-full py-4 text-lg transition-all mt-auto ${
                      addedToCart === selectedProduct.id
                        ? "bg-green-600"
                        : "bg-red-600 hover:bg-red-500"
                    }`}
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                  >
                    {addedToCart === selectedProduct.id ? (
                      <span className="flex items-center justify-center gap-2">
                        ✓ ADDED TO CART
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus size={20} />
                        ADD TO CART — ${(selectedProduct.price * quantity).toFixed(2)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buy Now Payment Popup */}
      {buyNowProduct && (
        <PaymentPopup
        isOpen={showBuyNowPopup}
        onClose={() => setShowBuyNowPopup(false)}
        amount={buyNowProduct.price * 4000}
        onPaymentConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
}
