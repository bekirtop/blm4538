import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressContextType {
  progress: number;
  addProgress: (amount: number) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const STORAGE_KEY = '@overall_progress_v1';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setProgress(Math.min(100, Math.max(0, parseInt(data, 10))));
      }
    } catch (error) {
      console.error('Failed to load progress', error);
    }
  };

  const saveProgress = async (newProgress: number) => {
    const clamped = Math.min(100, Math.max(0, newProgress));
    setProgress(clamped);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, clamped.toString());
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  const addProgress = (amount: number) => {
    // To use the most updated progress from state, pass a callback, or just use the current value
    // Using current state is usually fine, but to be safe:
    setProgress((prev) => {
      const newProgress = Math.min(100, Math.max(0, prev + amount));
      AsyncStorage.setItem(STORAGE_KEY, newProgress.toString()).catch(err => console.error(err));
      return newProgress;
    });
  };

  const resetProgress = () => {
    saveProgress(0);
  };

  return (
    <ProgressContext.Provider value={{ progress, addProgress, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
