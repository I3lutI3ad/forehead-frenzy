"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Home, RotateCw, Loader2 } from 'lucide-react';

type AttemptedWord = { word: string; status: 'correct' | 'skipped' };

function SummaryComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsParam = searchParams.get('results');
  const categoryParam = searchParams.get('category');
  const variantParam = searchParams.get('variant');

  let attemptedWords: AttemptedWord[] = [];
  try {
    if (resultsParam) {
      attemptedWords = JSON.parse(decodeURIComponent(resultsParam));
    } else {
        // Handle case where results are missing
        if (typeof window !== 'undefined') {
            router.push('/');
        }
    }
  } catch (error) {
    console.error("Failed to parse game results", error);
    if (typeof window !== 'undefined') {
        router.push('/');
    }
  }

  const score = attemptedWords.filter(w => w.status === 'correct').length;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl sm:text-5xl font-bold font-headline">Round Over!</CardTitle>
          <p className="text-2xl text-primary font-semibold mt-2">You scored {score}</p>
        </CardHeader>
        <CardContent>
          <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-2">
            {attemptedWords.length > 0 ? attemptedWords.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.status === 'correct' ? 'bg-primary/10' : 'bg-destructive/10'
                }`}
              >
                <span className="text-lg font-medium">{item.word}</span>
                {item.status === 'correct' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive" />
                )}
              </div>
            )) : (
                <p className="text-center text-muted-foreground p-4">You didn't attempt any words.</p>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={categoryParam ? `/game?category=${encodeURIComponent(categoryParam)}&variant=${encodeURIComponent(variantParam || 'General')}` : '/'} passHref>
              <Button className="w-full h-12 text-lg" variant="default">
                <RotateCw className="mr-2 h-5 w-5" /> Play Again
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button className="w-full h-12 text-lg" variant="outline">
                <Home className="mr-2 h-5 w-5" /> New Game
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


export default function SummaryPage() {
    return (
      <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <SummaryComponent />
      </Suspense>
    )
}
