'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const DependencyExtractorInputSchema = z.object({
  code: z.string().describe('The code snippet to extract dependencies from.'),
  programmingLanguage: z.string().describe('The programming language of the code.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type DependencyExtractorInput = z.infer<typeof DependencyExtractorInputSchema>;

const DependencyExtractorOutputSchema = z.object({
  dependencies: z.string().describe('The required import or require statements.'),
});
export type DependencyExtractorOutput = z.infer<typeof DependencyExtractorOutputSchema>;

const DependencyExtractorResultSchema = z.union([
    DependencyExtractorOutputSchema,
    z.object({ error: z.string() })
]);
export type DependencyExtractorResult = z.infer<typeof DependencyExtractorResultSchema>;


export async function extractDependencies(input: DependencyExtractorInput): Promise<DependencyExtractorResult> {
  try {
    const validatedInput = DependencyExtractorInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);
    
    const prompt = `You are an intelligent code analysis tool. Analyze the following code snippet and determine its dependencies.
    Return ONLY the necessary import (or require, etc.) statements for this code to run. Do not include any other code or explanation.

    Programming Language: ${validatedInput.programmingLanguage}
    Code:
    \`\`\`${validatedInput.programmingLanguage}
    ${validatedInput.code}
    \`\`\`
    `;

    const result = await ai.generate({
        prompt: prompt,
        config: { apiKey: key },
    });

    const dependencies = result.text;
    if (!dependencies) {
      throw new Error('Could not extract dependencies.');
    }
    
    return { dependencies: dependencies.trim() };

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in extractDependencies flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
