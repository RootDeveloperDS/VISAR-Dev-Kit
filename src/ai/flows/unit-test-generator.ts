'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const UnitTestGeneratorInputSchema = z.object({
  code: z.string().describe('The code snippet to generate tests for.'),
  programmingLanguage: z.string().describe('The programming language of the code.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type UnitTestGeneratorInput = z.infer<typeof UnitTestGeneratorInputSchema>;

const UnitTestSchema = z.object({
    question: z.string().describe('The multiple-choice question.'),
    options: z.array(z.string()).describe('An array of 4 possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
});
export type UnitTest = z.infer<typeof UnitTestSchema>;

const UnitTestGeneratorOutputSchema = z.object({
  tests: z.array(UnitTestSchema).describe('An array of 10 multiple-choice unit tests.'),
});
export type UnitTestGeneratorOutput = z.infer<typeof UnitTestGeneratorOutputSchema>;

const UnitTestGeneratorResultSchema = z.union([
    UnitTestGeneratorOutputSchema,
    z.object({ error: z.string() })
]);
export type UnitTestGeneratorResult = z.infer<typeof UnitTestGeneratorResultSchema>;


export async function generateUnitTests(input: UnitTestGeneratorInput): Promise<UnitTestGeneratorResult> {
  try {
    const validatedInput = UnitTestGeneratorInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);
    
    const prompt = `You are an expert programmer and educator. Based on the provided code snippet, generate a 10-question multiple-choice quiz to test a developer's understanding of it. Each question should have 4 options.

    Return a valid JSON object with a single key "tests" which is an array of 10 test objects. Each test object must have "question", "options" (an array of 4 strings), and "correctAnswer" keys.

    Programming Language: ${validatedInput.programmingLanguage}
    Code:
    \`\`\`${validatedInput.programmingLanguage}
    ${validatedInput.code}
    \`\`\`
    
    ONLY return the JSON object.
    `;

    const result = await ai.generate({
        prompt: prompt,
        config: { apiKey: key },
        output: {
            schema: UnitTestGeneratorOutputSchema,
        },
    });

    const output = result.output;
    if (!output) {
      throw new Error('No unit tests were generated.');
    }
    
    return UnitTestGeneratorOutputSchema.parse(output);

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in generateUnitTests flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
