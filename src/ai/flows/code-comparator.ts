'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const CodeComparatorInputSchema = z.object({
  codeSnippet1: z.string().describe('The first code snippet.'),
  codeSnippet2: z.string().describe('The second code snippet.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type CodeComparatorInput = z.infer<typeof CodeComparatorInputSchema>;

const CodeComparatorOutputSchema = z.object({
  summary: z.string().describe('A summary of the differences between the two code snippets.'),
});
export type CodeComparatorOutput = z.infer<typeof CodeComparatorOutputSchema>;

const CodeComparatorResultSchema = z.union([
    CodeComparatorOutputSchema,
    z.object({ error: z.string() })
]);
export type CodeComparatorResult = z.infer<typeof CodeComparatorResultSchema>;


export async function codeComparator(input: CodeComparatorInput): Promise<CodeComparatorResult> {
  try {
    const validatedInput = CodeComparatorInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);
    
    const prompt = `You are a senior software engineer. Compare the two code snippets below and summarize their differences, highlighting key changes in functionality or logic.

    Code Snippet 1:
    \`\`\`
    ${validatedInput.codeSnippet1}
    \`\`\`
    
    Code Snippet 2:
    \`\`\`
    ${validatedInput.codeSnippet2}
    \`\`\`
    
    Summary:`;

    const result = await ai.generate({
        prompt: prompt,
        config: { apiKey: key },
    });

    const summary = result.text;
    if (!summary) {
      throw new Error('No comparison summary was generated.');
    }

    return { summary };

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in codeComparator flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
