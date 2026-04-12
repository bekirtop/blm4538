import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MistakeWord {
  word: string;
  turkish: string;
  example?: string;
}

interface MistakesContextType {
  mistakes: MistakeWord[];
  addMistake: (word: MistakeWord) => void;
  removeMistake: (word: string) => void;
  clearMistakes: () => void;
}

const MistakesContext = createContext<MistakesContextType | undefined>(undefined);

const STORAGE_KEY = '@mistakes_v1';

export function MistakesProvider({ children }: { children: React.ReactNode }) {
  const [mistakes, setMistakes] = useState<MistakeWord[]>([]);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setMistakes(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load mistakes', error);
    }
  };

  const saveMistakes = async (newMistakes: MistakeWord[]) => {
    setMistakes(newMistakes);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMistakes));
    } catch (error) {
      console.error('Failed to save mistakes', error);
    }
  };

  const addMistake = (wordObj: MistakeWord) => {
    const existingIndex = mistakes.findIndex(m => m.word === wordObj.word);
    if (existingIndex !== -1) {
      // Move to top if it already exists
      const newMistakes = [...mistakes];
      newMistakes.splice(existingIndex, 1);
      newMistakes.unshift(wordObj);
      saveMistakes(newMistakes);
    } else {
      saveMistakes([wordObj, ...mistakes]);
    }
  };

  const removeMistake = (word: string) => {
    const newMistakes = mistakes.filter(m => m.word !== word);
    saveMistakes(newMistakes);
  };

  const clearMistakes = () => {
    saveMistakes([]);
  };

  return (
    <MistakesContext.Provider value={{ mistakes, addMistake, removeMistake, clearMistakes }}>
      {children}
    </MistakesContext.Provider>
  );
}

export function useMistakes() {
  const context = useContext(MistakesContext);
  if (context === undefined) {
    throw new Error('useMistakes must be used within a MistakesProvider');
  }
  return context;
}
