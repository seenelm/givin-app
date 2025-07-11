import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { 
  supabase, 
  getCurrentUser, 
  signInWithGoogle, 
  signInWithEmail, 
  signOut
} from '../utils/supabaseClient';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on component mount
    const checkUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      // Clean up the subscription
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) return { error: error.message };
      return { error: null };
    } catch (error) {
      console.error('Error signing in with email:', error);
      return { error: 'Failed to sign in' };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
