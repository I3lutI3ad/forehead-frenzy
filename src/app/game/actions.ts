"use server";

import { ensureEngagingWordDifficulty } from '@/ai/flows/difficulty-manager';
import { getWordsForCategory } from '@/lib/words';

export async function getNextWord(category: string, previousWords: string[]) {
  try {
    const result = await ensureEngagingWordDifficulty({ category, previousWords });
    return result.suggestedWord;
  } catch (error) {
    console.error("AI word suggestion failed. Using fallback.", error);
    // Fallback to a random word from the category list if AI fails
    const categoryWords = getWordsForCategory(category);
    const availableWords = categoryWords.filter(w => !previousWords.includes(w));
    if (availableWords.length > 0) {
      return availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    // If all words are exhausted, return a generic one
    return "Game Over";
  }
}
