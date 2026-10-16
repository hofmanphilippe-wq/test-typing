import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ChevronRight, Keyboard, Target, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Level, GameStats } from '../types';

interface TypingGameProps {
  level: Level;
  onComplete: (stats: GameStats) => void;
  onExit: () => void;
  onNextLevel?: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ level, onComplete, onExit, onNextLevel }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const handleLocalRestart = () => {
    setUserInput('');
    setStartTime(null);
    setErrors(0);
    setCurrentTextIndex(0);
    setIsCompleted(false);
    setWpm(0);
    setAccuracy(100);
  };
  
  const inputRef = useRef<HTMLInputElement>(null);
  const targetText = level.content[currentTextIndex];

  // Logic to focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [level, currentTextIndex]);

  // Calculate real-time stats
  useEffect(() => {
    if (!startTime || isCompleted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diffInMinutes = (now - startTime) / 60000;
      if (diffInMinutes > 0) {
        const charactersTyped = userInput.length;
        const currentWpm = Math.round((charactersTyped / 5) / diffInMinutes);
        setWpm(currentWpm);
      }

      // Accuracy
      if (userInput.length > 0) {
        const currentAcc = Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100));
        setAccuracy(currentAcc);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, userInput, errors, isCompleted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    // Identify if the last character was an error
    if (value.length > userInput.length) {
      const lastChar = value[value.length - 1];
      const expectedChar = targetText[value.length - 1];
      if (lastChar !== expectedChar) {
        setErrors(prev => prev + 1);
      }
    }

    setUserInput(value);

    // Check completion of current segment
    if (value === targetText) {
      if (currentTextIndex < level.content.length - 1) {
        // Prepare next segment
        setTimeout(() => {
          setCurrentTextIndex(prev => prev + 1);
          setUserInput('');
        }, 100);
      } else {
        // Level fully completed
        const endTime = Date.now();
        const totalTime = (endTime - (startTime || endTime)) / 1000;
        const finalWpm = Math.round((level.content.join(' ').length / 5) / (totalTime / 60));
        const finalAcc = Math.max(0, Math.round(((level.content.join(' ').length - errors) / level.content.join(' ').length) * 100));
        
        setIsCompleted(true);
        setWpm(finalWpm);
        setAccuracy(finalAcc);
        
        if (finalWpm >= level.minWpm && finalAcc >= level.minAccuracy) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        
        onComplete({
          wpm: finalWpm,
          accuracy: finalAcc,
          errors,
          timeTaken: totalTime
        });
      }
    }
  };

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let colorClass = 'text-gray-400';
      if (index < userInput.length) {
        colorClass = userInput[index] === char ? 'text-emerald-500' : 'text-rose-500 border-b-2 border-rose-500';
      } else if (index === userInput.length) {
        colorClass = 'text-gray-900 bg-gray-200 animate-pulse rounded';
      }

      return (
        <span key={index} className={`${colorClass} transition-colors duration-150`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">{level.name}</h2>
          <p className="text-gray-500">{level.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <Timer className="w-4 h-4 text-emerald-500" />
            <span className="font-mono font-medium">{wpm} <span className="text-[10px] uppercase opacity-50">WPM</span></span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <Target className="w-4 h-4 text-amber-500" />
            <span className="font-mono font-medium">{accuracy}% <span className="text-[10px] uppercase opacity-50">ACC</span></span>
          </div>
        </div>
      </div>

      <div 
        className="relative mb-12 p-8 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[200px] flex items-center justify-center text-3xl font-mono leading-relaxed tracking-wider break-words selection:bg-emerald-100 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative z-10 w-full text-center">
          {renderText()}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-default"
          value={userInput}
          onChange={handleInputChange}
          autoFocus
          disabled={isCompleted}
        />
        
        {!startTime && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400 italic pointer-events-none"
          >
            Begin met typen om te starten...
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/50">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Voortgang</p>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300" 
              style={{ width: `${((currentTextIndex + (userInput.length / targetText.length)) / level.content.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/50">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Fouten</p>
          <p className="text-xl font-mono font-bold text-rose-500">{errors}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/50">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Vereist WPM</p>
          <p className="text-xl font-mono font-bold text-gray-600">{level.minWpm}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/50">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Vereist Acc</p>
          <p className="text-xl font-mono font-bold text-gray-600">{level.minAccuracy}%</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleLocalRestart}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-all hover:bg-gray-100 rounded-2xl"
        >
          <RotateCcw className="w-4 h-4" />
          Herstarten
        </button>
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-gray-600 font-medium transition-all hover:bg-gray-100 rounded-2xl"
        >
          Terug naar overzicht
        </button>
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-gray-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-gray-900 font-sans tracking-tight">Klasse gedaan!</h3>
              <p className="text-gray-500 mb-8 font-medium">Je hebt {level.name} afgerond.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-emerald-50 rounded-3xl">
                  <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider mb-1">Snelheid</p>
                  <p className="text-3xl font-mono font-bold text-emerald-600">{wpm}</p>
                  <p className="text-xs font-medium text-emerald-700">WPM</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-3xl">
                  <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider mb-1">Precisie</p>
                  <p className="text-3xl font-mono font-bold text-amber-600">{accuracy}%</p>
                  <p className="text-xs font-medium text-amber-700">ACC</p>
                </div>
              </div>

              {(wpm < level.minWpm || accuracy < level.minAccuracy) ? (
                <div className="mb-8 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-medium">
                  Helaas, je hebt de doelstellingen nog niet gehaald. Probeer het nog een keer!
                </div>
              ) : (
                <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium">
                  Fantastisch! Je bent klaar voor de volgende uitdaging.
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (wpm >= level.minWpm && accuracy >= level.minAccuracy && onNextLevel) {
                      onNextLevel();
                    } else {
                      handleLocalRestart();
                    }
                  }}
                  className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  {(wpm < level.minWpm || accuracy < level.minAccuracy) ? 'Nog een keer' : 'Volgende Opdracht'}
                </button>
                <button
                  onClick={onExit}
                  className="w-full py-2 text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors"
                >
                  Terug naar overzicht
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
