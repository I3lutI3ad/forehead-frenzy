"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTilt } from '@/hooks/use-tilt';
import { getNextWord } from './actions';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

type GameState = 'loading' | 'request_permission' | 'ready' | 'playing' | 'finished';
type AttemptedWord = { word: string; status: 'correct' | 'skipped' };
const ROUND_DURATION = 30;

function RotateDevicePrompt() {
  return (
    <div className="md:hidden portrait:flex landscape:hidden fixed inset-0 bg-background z-50 flex-col items-center justify-center text-center p-4">
      <Smartphone className="w-16 h-16 rotate-90 mb-4 text-primary" />
      <h2 className="text-2xl font-bold mb-2">Please rotate your device</h2>
      <p className="text-muted-foreground">This game is best played in landscape mode.</p>
    </div>
  );
}


function GameComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Mixed';
  const variant = searchParams.get('variant') || 'General';

  const [gameState, setGameState] = useState<GameState>('loading');
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [currentWord, setCurrentWord] = useState('');
  const [previousWords, setPreviousWords] = useState<string[]>([]);
  const [attemptedWords, setAttemptedWords] = useState<AttemptedWord[]>([]);
  const [tiltFeedback, setTiltFeedback] = useState<'correct' | 'skipped' | null>(null);

  const fetchAndSetNextWord = useCallback(async () => {
    setCurrentWord(''); // Show loader
    const nextWord = await getNextWord(category, variant, previousWords);
    setCurrentWord(nextWord);
    setPreviousWords(prev => [...prev, nextWord]);
  }, [category, variant, previousWords]);

  const handlePermissions = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setGameState('ready');
        } else {
          alert('Permission for device orientation is required to play the game.');
          router.push('/');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while requesting permissions.');
        router.push('/');
      }
    } else {
      setGameState('ready');
    }
  };

  useEffect(() => {
    if (gameState === 'loading') {
       if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
         setGameState('request_permission');
       } else {
         setGameState('ready');
       }
    }
  }, [gameState]);

  const handleReady = () => {
    setGameState('playing');
    fetchAndSetNextWord();
  };

  const processAnswer = useCallback((status: 'correct' | 'skipped') => {
    if (!currentWord || gameState !== 'playing') return;

    setAttemptedWords(prev => [...prev, { word: currentWord, status }]);
    setTiltFeedback(status);
    setTimeout(() => setTiltFeedback(null), 500);
    fetchAndSetNextWord();
  }, [currentWord, gameState, fetchAndSetNextWord]);

  const handleCorrect = useCallback(() => processAnswer('correct'), [processAnswer]);
  const handleSkip = useCallback(() => processAnswer('skipped'), [processAnswer]);

  useTilt(handleSkip, handleCorrect, gameState === 'playing');

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      const results = JSON.stringify(attemptedWords);
      router.push(`/summary?results=${encodeURIComponent(results)}&category=${encodeURIComponent(category)}&variant=${encodeURIComponent(variant)}`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, attemptedWords, router, category, variant]);

  const getBackgroundColor = () => {
    if (tiltFeedback === 'correct') return 'bg-primary/20';
    if (tiltFeedback === 'skipped') return 'bg-destructive/20';
    return 'bg-card';
  };
  
  const renderContent = () => {
    switch(gameState) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
      case 'request_permission':
        return (
          <div className="text-center p-4">
            <h1 className="text-3xl font-bold mb-4">Permission Required</h1>
            <p className="mb-8 max-w-md">This game uses your device's motion sensors to detect tilts. Please grant permission to continue.</p>
            <Button onClick={handlePermissions} size="lg">Grant Permission</Button>
          </div>
        );
      case 'ready':
        return (
          <div className="text-center p-4">
            <h2 className="text-2xl font-semibold text-muted-foreground">Category: {category} ({variant})</h2>
            <h1 className="text-8xl font-bold my-8 text-primary">Ready?</h1>
            <p className="text-xl mb-8">Place the phone on your forehead!</p>
            <Button onClick={handleReady} size="lg" className="text-2xl h-16 px-12">
              Start
            </Button>
          </div>
        );
      case 'playing':
      case 'finished':
        return (
          <>
            <div className="absolute top-4 right-4 text-5xl font-bold text-primary">{timeLeft}</div>
            <Card className={`flex items-center justify-center w-[90vw] h-[60vh] transition-colors duration-300 shadow-2xl ${getBackgroundColor()}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWord || 'loader'}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center w-full h-full"
                  >
                    {currentWord ? (
                      <h1 className="text-6xl md:text-9xl font-bold text-center break-words px-4 font-headline">
                        {currentWord}
                      </h1>
                    ) : (
                      <Loader2 className="h-24 w-24 animate-spin text-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
            </Card>
            <div className="mt-8 flex gap-8 items-center text-muted-foreground">
                <div className="flex items-center gap-2">
                  <X className="h-8 w-8 text-destructive"/>
                  <span className="text-lg">Tilt Up to Skip</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">Tilt Down for Correct</span>
                  <Check className="h-8 w-8 text-emerald-500"/>
                </div>
            </div>
          </>
        )
    }
  }

  return (
    <main className={`flex min-h-screen w-full flex-col items-center justify-center transition-colors duration-300 ${getBackgroundColor()}`}>
        <RotateDevicePrompt />
        {renderContent()}
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <GameComponent />
    </Suspense>
  )
}
