'use server';
/**
 * @fileOverview Manages word difficulty to ensure an engaging gameplay experience.
 *
 * - ensureEngagingWordDifficulty - A function that suggests an engaging word given previous words.
 * - EnsureEngagingWordDifficultyInput - The input type for the ensureEngagingWordDifficulty function.
 * - EnsureEngagingWordDifficultyOutput - The return type for the ensureEngagingWordDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnsureEngagingWordDifficultyInputSchema = z.object({
  category: z.string().describe('The category of words to choose from (e.g., Animals, TV Shows, Celebrities).'),
  previousWords: z.array(z.string()).describe('The list of words already used in the current round.'),
});
export type EnsureEngagingWordDifficultyInput = z.infer<typeof EnsureEngagingWordDifficultyInputSchema>;

const EnsureEngagingWordDifficultyOutputSchema = z.object({
  suggestedWord: z.string().describe('A word suggestion that differs from the previous words, and is of reasonable difficulty.'),
});
export type EnsureEngagingWordDifficultyOutput = z.infer<typeof EnsureEngagingWordDifficultyOutputSchema>;

export async function ensureEngagingWordDifficulty(input: EnsureEngagingWordDifficultyInput): Promise<EnsureEngagingWordDifficultyOutput> {
  return ensureEngagingWordDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ensureEngagingWordDifficultyPrompt',
  input: {schema: EnsureEngagingWordDifficultyInputSchema},
  output: {schema: EnsureEngagingWordDifficultyOutputSchema},
  prompt: `You are an expert word selector for the "Forehead Frenzy" game. Your goal is to suggest a word from the given category that is engaging and not too similar to previously used words.

Category: {{{category}}}
Previous Words: {{#each previousWords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest a word that is different from the previous words, of reasonable difficulty, and appropriate to the specified category.  Return ONLY the word itself. Do not include any other prose.

For example, if the category is 'Animals' and the previous words are 'Dog, Cat, Hamster', then a good choice might be 'Elephant'.
`,
});

const ensureEngagingWordDifficultyFlow = ai.defineFlow(
  {
    name: 'ensureEngagingWordDifficultyFlow',
    inputSchema: EnsureEngagingWordDifficultyInputSchema,
    outputSchema: EnsureEngagingWordDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      suggestedWord: output!.suggestedWord,
    };
  }
);
