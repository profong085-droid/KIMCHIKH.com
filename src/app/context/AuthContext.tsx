import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { auth, db } from '../../lib/supabase';

type SavedOrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type SavedOrder = {
  id: string;
  orderNumber: string;
  date: string;
  items: SavedOrderItem[];
  totalPrice: number;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  savedOrders: SavedOrder[];
  saveOrder: (order: {
    orderNumber: string;
    date: string;
    items: SavedOrderItem[];
    totalPrice: number;
    customer: {
      fullName: string;
      email: string;
      phone: string;
      telegramPhone: string;
      notes: string;
    };
    status: string;
  }) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);

  useEffect(() => {
    auth.getCurrentUser().then((currentUser: User | null) => {
      setUser(currentUser);
    });

    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (_event: string, newSession: Session | null) => {
      console.log('Auth event:', _event);
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.id) {
        try {
          const rows = await db.getUserOrders(currentUser.id);
          const mapped: SavedOrder[] = rows.map((row: any) => ({
            id: row.id,
            orderNumber: row.order_number ?? row.orderNumber ?? '',
            date: row.created_at ?? new Date().toISOString(),
            items: (row.items ?? []) as SavedOrderItem[],
            totalPrice: Number(row.total_amount ?? row.totalPrice ?? 0),
          }));
          setSavedOrders(mapped);
        } catch (err) {
          console.error('Failed to load user orders:', err);
        }
      } else {
        setSavedOrders([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await auth.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setSavedOrders([]);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const saveOrder: AuthContextType['saveOrder'] = async (order) => {
    if (!user?.id) {
      throw new Error('Must be logged in to save order');
    }

    const row = await db.saveOrder({
      userId: user.id,
      items: order.items,
      totalAmount: order.totalPrice,
      customerInfo: order.customer,
      paymentMethod: 'KHQR',
      paymentStatus: order.status,
      screenshotUrl: undefined,
    });

    const mapped: SavedOrder = {
      id: row.id,
      orderNumber: row.order_number ?? order.orderNumber,
      date: row.created_at ?? order.date,
      items: (row.items ?? order.items) as SavedOrderItem[],
      totalPrice: Number(row.total_amount ?? order.totalPrice),
    };

    setSavedOrders((prev) => [mapped, ...prev]);
  };

  const deleteOrder: AuthContextType['deleteOrder'] = async (orderId) => {
    try {
      await db.updateOrderStatus(orderId, 'deleted');
    } catch (err) {
      console.error('Failed to update order status in database:', err);
    }
    setSavedOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    savedOrders,
    saveOrder,
    deleteOrder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
