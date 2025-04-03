
import { create } from 'zustand';

interface PerformanceSettings {
  mode: 'high-quality' | 'performance' | 'ps5' | 'default';
  setMode: (mode: 'high-quality' | 'performance' | 'ps5' | 'default') => void;
}

export const usePerformanceSettings = create<PerformanceSettings>((set) => ({
  mode: 'default',
  setMode: (mode) => set({ mode }),
}));
