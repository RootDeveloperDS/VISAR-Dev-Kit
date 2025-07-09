'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const SuggestNameInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet containing the variable or function.'),
  nameToRename: z.string().describe('The variable or function name to be renamed.'),
  language: z.string().optional().describe('The programming language of the code snippet.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});

export type SuggestNameInput = z.infer<typeof SuggestNameInputSchema>;

const SuggestNameOutputSchema = z.object({
  suggestedName: z.string().describe('A suggested descriptive and meaningful name.'),
  explanation: z.string().describe('An explanation of why the suggested name is appropriate.'),
});

export type SuggestNameOutput = z.infer<typeof SuggestNameOutputSchema>;

const SuggestNameResultSchema = z.union([
  SuggestNameOutputSchema,
  z.object({ error: z.string() })
]);
export type SuggestNameResult = z.infer<typeof SuggestNameResultSchema>;

export async function suggestName(input: SuggestNameInput): Promise<SuggestNameResult> {
  try {
    const validatedInput = SuggestNameInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);

    const prompt = `You are an expert software developer. You will suggest a better name for a variable or function in a code snippet.

      The code is written in the following language: ${validatedInput.language || 'not specified'}

      Given the following code snippet:
      \`\`\`${validatedInput.language || ''}
      ${validatedInput.codeSnippet}
      \`\`\`

      Suggest a better name for the following variable or function: ${validatedInput.nameToRename}.
      Return a valid JSON object with the suggested name and an explanation of why it is a good choice.  The explanation should be less than 2 sentences.

      Be concise and accurate. The suggested name should be in the same case style as the original name.

      Example Output:
      {
        "suggestedName": "calculateTotalAmount",
        "explanation":
          "This name clearly indicates the function's purpose, which is to calculate the total amount, improving readability."
      }
      
      ONLY return the JSON object.`;

    const result = await ai.generate({
      prompt: prompt,
      config: { apiKey: key },
      output: {
        schema: SuggestNameOutputSchema,
      },
    });

    const output = result.output;
    if (!output) {
      throw new Error('No valid suggestion was generated.');
    }
    
    return SuggestNameOutputSchema.parse(output);

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in suggestName flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
