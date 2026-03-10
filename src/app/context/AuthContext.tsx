import { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {
 auth,
 googleProvider,
 signInWithGoogle,
 loginWithEmail as firebaseLogin,
 signupWithEmail,
 logout as firebaseLogout,
 onAuthChange
} from '../../firebase';
import { User as FirebaseUser} from 'firebase/auth';

interface User {
  email: string;
  name?: string;
  avatar?: string;
  uid: string;
}

interface SavedOrder {
  id: string;
  orderNumber: string;
  date: string;
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
  status: 'pending' | 'completed' | 'cancelled';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  savedOrders: SavedOrder[];
  saveOrder: (order: Omit<SavedOrder, 'id'>) => void;
  deleteOrder: (orderId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and orders from localStorage on mount
  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthChange((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
         email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User')}&background=random`,
          uid: firebaseUser.uid
        };
        setUser(user);
        localStorage.setItem('kimchi_user', JSON.stringify(user));
        
        // Load saved orders for this user
        const storedOrders = localStorage.getItem(`kimchi_orders_${firebaseUser.uid}`);
        if (storedOrders) {
          setSavedOrders(JSON.parse(storedOrders));
        }
      } else {
        setUser(null);
        localStorage.removeItem('kimchi_user');
        setSavedOrders([]);
      }
      setIsLoading(false);
    });

   return () => unsubscribe();
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kimchi_orders', JSON.stringify(savedOrders));
  }, [savedOrders]);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      // Auth state change will handle user setup
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await firebaseLogin(email, password);
      // Auth state change will handle user setup
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signupWithEmailAndPass = async (email: string, password: string) => {
    try {
      await signupWithEmail(email, password);
      // Auth state change will handle user setup
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
   try {
     await firebaseLogout();
     setUser(null);
     localStorage.removeItem('kimchi_user');
     setSavedOrders([]);
   } catch (error) {
     console.error("Logout error:", error);
   }
  };

  const saveOrder = (order: Omit<SavedOrder, 'id'>) => {
   if (!user) return;
   
   const newOrder: SavedOrder = {
     ...order,
     id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
   };
   
   setSavedOrders(prev => {
     const updated = [newOrder, ...prev];
     // Save to localStorage with user UID
     localStorage.setItem(`kimchi_orders_${user.uid}`, JSON.stringify(updated));
   return updated;
   });
  };

  const deleteOrder= (orderId: string) => {
   if (!user) return;
   
   setSavedOrders(prev => {
     const updated = prev.filter(order => order.id !== orderId);
     localStorage.setItem(`kimchi_orders_${user.uid}`, JSON.stringify(updated));
   return updated;
   });
  };

 return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loginWithGoogle,
      loginWithEmail,
      logout,
      savedOrders,
      saveOrder,
      deleteOrder,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
 return context;
}
