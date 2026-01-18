import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { User, DEFAULT_USER } from '@/types';

const USER_STORAGE_KEY = '@daily_prayer_user';

export const [UserProvider, useUser] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User>(DEFAULT_USER);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
      return DEFAULT_USER;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newUser: User) => {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });

  const { mutate: saveUser } = saveMutation;

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      saveUser(newUser);
      return newUser;
    });
  }, [saveUser]);

  const resetStreak = useCallback(() => {
    updateUser({ currentStreak: 0 });
  }, [updateUser]);

  const incrementStreak = useCallback(() => {
    setUser(prev => {
      const newStreak = prev.currentStreak + 1;
      const newLongest = Math.max(newStreak, prev.longestStreak);
      const newUser = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalPrayers: prev.totalPrayers + 1,
        lastPrayerDate: new Date().toISOString().split('T')[0],
        completedToday: true,
      };
      saveUser(newUser);
      return newUser;
    });
  }, [saveUser]);

  const checkAndResetDaily = useCallback(() => {
    setUser(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastPrayer = prev.lastPrayerDate;
      
      if (lastPrayer && lastPrayer !== today) {
        const lastDate = new Date(lastPrayer);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          const newUser = { ...prev, currentStreak: 0, completedToday: false };
          saveUser(newUser);
          return newUser;
        } else if (diffDays === 1) {
          const newUser = { ...prev, completedToday: false };
          saveUser(newUser);
          return newUser;
        }
      }
      return prev;
    });
  }, [saveUser]);

  const recordTopicPlay = useCallback((topicId: string) => {
    const now = new Date().toISOString();
    setUser(prev => {
      const newUser = {
        ...prev,
        topicLastPlayed: { ...prev.topicLastPlayed, [topicId]: now },
        topicPlayCount: { 
          ...prev.topicPlayCount, 
          [topicId]: (prev.topicPlayCount[topicId] || 0) + 1 
        },
      };
      saveUser(newUser);
      return newUser;
    });
  }, [saveUser]);

  const toggleFavoriteVerse = useCallback((verseId: string) => {
    setUser(prev => {
      const favorites = prev.favoriteVerses.includes(verseId)
        ? prev.favoriteVerses.filter(id => id !== verseId)
        : [...prev.favoriteVerses, verseId];
      const newUser = { ...prev, favoriteVerses: favorites };
      saveUser(newUser);
      return newUser;
    });
  }, [saveUser]);

  return {
    user,
    isLoading: userQuery.isLoading,
    updateUser,
    resetStreak,
    incrementStreak,
    checkAndResetDaily,
    recordTopicPlay,
    toggleFavoriteVerse,
  };
});
