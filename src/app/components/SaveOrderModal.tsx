import { motion, AnimatePresence} from "motion/react";
import { X, Save, Mail, LogIn, User, LogOut, History, Trash2} from "lucide-react";
import {useAuth} from "../context/AuthContext";
import {useState} from 'react';
import {signupWithEmail} from '../../firebase';

interface SaveOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
    totalPrice: number;
    customer: {
      fullName: string;
      email: string;
      phone: string;
      telegramPhone: string;
      notes: string;
    };
    orderNumber: string;
  };
}

export function SaveOrderModal({ isOpen, onClose, orderData }: SaveOrderModalProps) {
  const {user, isAuthenticated, loginWithGoogle, loginWithEmail, logout, savedOrders, saveOrder, deleteOrder} = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const handleSaveOrder = async () => {
    if (!isAuthenticated || !orderData) return;
    
    saveOrder({
      orderNumber: orderData.orderNumber,
      date: new Date().toLocaleString(),
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      customer: orderData.customer,
      status: 'completed'
    });
    
    alert('✅ Order saved successfully to your account!');
   onClose();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
   e.preventDefault();
    try {
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      setShowLogin(false);
      setEmail('');
      setPassword('');
      setIsSignup(false);
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gradient-to-br from-gray-900 to-black z-10">
                <div className="flex items-center gap-3">
                  <Save size={24} className="text-blue-500" />
                  <h2 className="text-xl text-white tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    SAVE ORDER
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {!isAuthenticated ? (
                  /* Login Required */
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-white/80 mb-2">🔐 Login to save your orders</p>
                      <p className="text-white/60 text-sm">
                        Save your cart and order history to your personal account
                      </p>
                    </div>

                    <button
                      onClick={loginWithGoogle}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all"
                    >
                      <Mail size={20} />
                      <span>Login with Email / Google</span>
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gradient-to-br from-gray-900 to-black px-2 text-white/60">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLogin(true)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all"
                    >
                      <LogIn size={20} />
                      <span>Email Account</span>
                    </button>
                  </div>
                ) : (
                  /* User is logged in */
                  <div className="space-y-4">
                    {/* User Profile */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                      {user?.avatar && (
                        <img 
                          src={user.avatar} 
                          alt={user.name || 'User'} 
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-bold">{user?.name}</p>
                        <p className="text-white/60 text-sm">{user?.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Logout"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>

                    {orderData && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                          <Save size={18} />
                          Save This Order?
                        </h3>
                        <p className="text-white/70 text-sm mb-3">
                          Order: <span className="text-white font-mono">{orderData.orderNumber}</span>
                        </p>
                        <p className="text-white/70 text-sm mb-3">
                          Total: <span className="text-green-400 font-bold">${orderData.totalPrice.toFixed(2)}</span>
                        </p>
                        <p className="text-white/60 text-xs mb-4">
                          This order will be saved to your account and you can view it anytime from your order history.
                        </p>
                        <button
                          onClick={handleSaveOrder}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all"
                        >
                          <Save size={20} />
                          <span>Save Order to My Account</span>
                        </button>
                      </div>
                    )}

                    {/* View Saved Orders */}
                    <button
                      onClick={() => setShowOrders(!showOrders)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all"
                    >
                      <History size={20} />
                      <span>{showOrders ? 'Hide' : 'View'} My Saved Orders ({savedOrders.length})</span>
                    </button>

                    {showOrders && savedOrders.length > 0 && (
                      <div className="space-y-3">
                        <div className="border-t border-white/10 pt-3">
                          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <History size={18} />
                            Order History
                          </h4>
                        </div>
                        
                        {savedOrders.map((order) => (
                          <div key={order.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-mono text-sm">{order.orderNumber}</p>
                                <p className="text-white/60 text-xs">{order.date}</p>
                              </div>
                              <p className="text-green-400 font-bold">${order.totalPrice.toFixed(2)}</p>
                            </div>
                            <p className="text-white/70 text-xs mb-2">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-3 rounded text-xs flex items-center justify-center gap-2 transition-all"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Email Login/Signup Form */}
                {showLogin && (
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="text-center mb-2">
                      <h3 className="text-white font-bold text-lg">
                        {isSignup? 'Create Account' : 'Login with Email'}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {isSignup? 'Sign up with your real Gmail or email' : 'Login to your existing account'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                       placeholder="your@gmail.com"
                     />
                   </div>
                   <div>
                     <label className="block text-white/80 text-sm mb-2">Password</label>
                     <input
                       type="password"
                       value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                       minLength={6}
                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                       placeholder="•••••••• (min 6 characters)"
                     />
                   </div>
                   <button
                     type="submit"
                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all"
                   >
                     {isSignup? '✅ Create Account' : '🔐 Login'}
                   </button>
                   <div className="text-center">
                     <button
                       type="button"
                      onClick={() => setIsSignup(!isSignup)}
                       className="text-blue-400 hover:text-blue-300 text-sm underline"
                     >
                       {isSignup? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                     </button>
                   </div>
                   <button
                     type="button"
                    onClick={() => setShowLogin(false)}
                     className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-all"
                   >
                     Cancel
                   </button>
                 </form>
               )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
