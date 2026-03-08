import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black border-l border-white/10 z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-red-500" />
                <h2 className="text-xl text-white tracking-widest"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                  CART ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} className="text-white/10 mb-4" />
                  <p className="text-white/40 text-sm tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    YOUR CART IS EMPTY
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 border border-red-500 text-red-500 text-sm tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-sm"
                      />
                      <div className="flex-1">
                        <h3 className="text-white text-sm tracking-wide mb-1"
                          style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                          {item.name}
                        </h3>
                        <p className="text-red-500 text-sm tracking-widest mb-3"
                          style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border border-white/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-white/60 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white text-xs tracking-widest w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-white/60 hover:text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-white/40 hover:text-red-500 transition-colors ml-auto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    SUBTOTAL
                  </span>
                  <span className="text-red-500 text-xl tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-white/40 text-xs">
                  Shipping and taxes calculated at checkout
                </p>
                
                <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
                
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-4 bg-red-600 text-white text-sm tracking-widest hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                >
                  <CreditCard size={18} />
                  CHECKOUT
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-white/20 text-white/40 text-sm tracking-widest hover:border-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                >
                  CLEAR CART
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
