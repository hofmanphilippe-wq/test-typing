import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, ChevronRight, Star } from 'lucide-react';
import { Level, UserProgress } from '../types';
import { LEVELS } from '../levels';

interface LevelListProps {
  progress: UserProgress;
  onSelectLevel: (level: Level) => void;
}

export const LevelList: React.FC<LevelListProps> = ({ progress, onSelectLevel }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
            Vinger<span className="text-emerald-500">Vlug</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Verbeter je typekunst stap voor stap. Van beginner tot een echte pro!
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEVELS.map((level, index) => {
          const isCompleted = progress.completedLevels.includes(level.id);
          const isUnlocked = level.id === 1 || progress.completedLevels.includes(level.id - 1) || level.id <= progress.currentLevel;
          const bestStats = progress.bestStats[level.id];

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
              className={`relative group rounded-[32px] p-6 border-2 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-50 border-emerald-100 shadow-xl shadow-emerald-500/10' 
                  : isUnlocked 
                    ? 'bg-white border-gray-100 hover:border-emerald-200 shadow-xl shadow-gray-200/50' 
                    : 'bg-gray-50 border-gray-50 opacity-60 grayscale'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                  isCompleted ? 'bg-emerald-500 text-white' : isUnlocked ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-400'
                }`}>
                  {level.id}
                </div>
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : !isUnlocked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : null}
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {level.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-6">
                {level.description}
              </p>

              {bestStats && (
                <div className="flex gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WPM</p>
                    <p className="font-mono font-bold text-gray-700">{bestStats.wpm}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Acc</p>
                    <p className="font-mono font-bold text-gray-700">{bestStats.accuracy}%</p>
                  </div>
                  {bestStats.accuracy >= 98 && (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 mt-4" />
                  )}
                </div>
              )}

              <button
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(level)}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : isUnlocked 
                      ? 'bg-gray-900 text-white hover:bg-emerald-600 shadow-lg shadow-gray-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? 'Opnieuw' : isUnlocked ? 'Starten' : 'Vergrendeld'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
