'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';


const PseudocodeGeneratorInputSchema = z.object({
  code: z.string().describe('The code snippet to generate pseudocode for.'),
  programmingLanguage: z.string().describe('The programming language of the code snippet.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type PseudocodeGeneratorInput = z.infer<typeof PseudocodeGeneratorInputSchema>;

const PseudocodeGeneratorOutputSchema = z.object({
  pseudocode: z.string().describe('The generated pseudocode explaining the code logic.'),
});
export type PseudocodeGeneratorOutput = z.infer<typeof PseudocodeGeneratorOutputSchema>;

const PseudocodeGeneratorResultSchema = z.union([
    PseudocodeGeneratorOutputSchema,
    z.object({ error: z.string() })
]);
export type PseudocodeGeneratorResult = z.infer<typeof PseudocodeGeneratorResultSchema>;


export async function generatePseudocode(input: PseudocodeGeneratorInput): Promise<PseudocodeGeneratorResult> {
 try {
    const validatedInput = PseudocodeGeneratorInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);

    const prompt = `You are an expert software developer who translates code into pseudocode.

    Given the following code snippet, generate pseudocode that explains the code's logic in plain language. The pseudocode should be detailed and easy to understand, suitable for creating tutorials or documentation. Return only the pseudocode, without any surrounding text or explanations.
  
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

    const pseudocode = result.text;
    if (!pseudocode) {
      throw new Error('No pseudocode was generated.');
    }

    return { pseudocode };

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in generatePseudocode flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
