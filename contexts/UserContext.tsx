
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';
import { Tables } from '@/app/integrations/supabase/types';

type User = Tables<'users'>;

interface UserContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUserId: (id: string) => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (id: string) => {
    try {
      console.log('Loading user with ID:', id);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading user:', error);
        return;
      }

      console.log('User loaded successfully:', data);
      setUser(data);
    } catch (err) {
      console.error('Unexpected error loading user:', err);
    }
  };

  const refreshUser = async () => {
    if (userId) {
      await loadUser(userId);
    }
  };

  const setUserId = async (id: string) => {
    await AsyncStorage.setItem('userId', id);
    setUserIdState(id);
    await loadUser(id);
  };

  const clearUser = async () => {
    await AsyncStorage.removeItem('userId');
    setUserIdState(null);
    setUser(null);
  };

  useEffect(() => {
    const initUser = async () => {
      try {
        console.log('Initializing user context...');
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('Stored user ID:', storedUserId);
        if (storedUserId) {
          setUserIdState(storedUserId);
          await loadUser(storedUserId);
        } else {
          console.log('No stored user ID found');
        }
      } catch (err) {
        console.error('Error initializing user:', err);
      } finally {
        console.log('User context initialization complete');
        setLoading(false);
      }
    };

    initUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        loading,
        refreshUser,
        setUserId,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
