/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TypingGame } from './components/TypingGame';
import { LevelList } from './components/LevelList';
import { Level, UserProgress, GameStats } from './types';
import { LEVELS } from './levels';
import { Keyboard, Trophy, User, Settings } from 'lucide-react';

const STORAGE_KEY = 'vingervlug_progress';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      currentLevel: 1,
      completedLevels: [],
      bestStats: {}
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const handleLevelComplete = (stats: GameStats) => {
    if (!currentLevel) return;

    const isSuccess = stats.wpm >= currentLevel.minWpm && stats.accuracy >= currentLevel.minAccuracy;

    if (isSuccess) {
      setProgress(prev => {
        const newCompleted = prev.completedLevels.includes(currentLevel.id) 
          ? prev.completedLevels 
          : [...prev.completedLevels, currentLevel.id];
        
        const nextLevelId = Math.max(prev.currentLevel, currentLevel.id + 1);
        
        // Update best stats if current is better
        const currentBest = prev.bestStats[currentLevel.id];
        const newBest = !currentBest || (stats.wpm > currentBest.wpm) 
          ? stats 
          : currentBest;

        return {
          currentLevel: nextLevelId,
          completedLevels: newCompleted,
          bestStats: {
            ...prev.bestStats,
            [currentLevel.id]: newBest
          }
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans selection:bg-emerald-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentLevel(null)}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <Keyboard className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">VingerVlug</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-100">
              <Trophy className="w-4 h-4" />
              <span>Lvl {progress.currentLevel}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentLevel ? (
          <TypingGame 
            key={currentLevel.id}
            level={currentLevel} 
            onComplete={handleLevelComplete}
            onExit={() => setCurrentLevel(null)}
            onNextLevel={() => {
              const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);
              if (nextLevel) {
                setCurrentLevel(nextLevel);
              } else {
                setCurrentLevel(null);
              }
            }}
          />
        ) : (
          <LevelList 
            progress={progress}
            onSelectLevel={(level) => setCurrentLevel(level)}
          />
        )}
      </main>

      <footer className="py-12 border-t border-gray-100 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-30">
            <Keyboard className="w-5 h-5" />
            <span className="font-bold tracking-tighter text-lg">VingerVlug</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Voorwaarden</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Help</a>
          </div>
          <div className="text-sm font-medium text-gray-400">
            &copy; 2024 VingerVlug. Gemaakt voor slimme leerlingen.
          </div>
        </div>
      </footer>
    </div>
  );
}

