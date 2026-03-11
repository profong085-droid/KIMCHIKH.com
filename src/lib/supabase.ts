import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only when environment variables are present.
// When missing, we run in "Supabase disabled" mode so the UI can still load.
let supabaseClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error(
    'បាត់ Key! សូមឆែកមើល .env ឬ Vercel Settings → Environment Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
  );
  console.warn(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env to enable auth and order persistence.'
  );
}

export const supabase = supabaseClient;

// Helper functions for authentication
export const auth = {
  // Sign in with Google (OAuth)
  signInWithGoogle: async () => {
    if (!supabaseClient) {
      console.warn('Supabase auth is disabled because environment variables are missing.');
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    if (!supabaseClient) {
      console.warn('Supabase auth is disabled because environment variables are missing.');
      return;
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabaseClient) {
      return null;
    }

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    return user;
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabaseClient) {
      // Immediately report a signed-out state and return a no-op subscription
      callback('SIGNED_OUT', null);
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      } as any;
    }

    return supabaseClient.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const db = {
  // Save order to database
  saveOrder: async (orderData: {
    userId: string;
    items: any[];
    totalAmount: number;
    customerInfo: {
      fullName: string;
      email: string;
      phone: string;
      telegramPhone: string;
      address: string;
    };
    paymentMethod: string;
    paymentStatus: string;
    screenshotUrl?: string;
  }) => {
    if (!supabaseClient) {
      throw new Error('Supabase is not configured. Cannot save order.');
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's orders
  getUserOrders: async (userId: string) => {
    if (!supabaseClient) {
      console.warn('Supabase is not configured. Returning empty order list.');
      return [];
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single order by ID
  getOrderById: async (orderId: string) => {
    if (!supabaseClient) {
      throw new Error('Supabase is not configured. Cannot load order.');
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    if (!supabaseClient) {
      throw new Error('Supabase is not configured. Cannot update order status.');
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
