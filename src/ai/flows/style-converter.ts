'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const StyleConverterInputSchema = z.object({
  code: z.string().describe('The code snippet to convert.'),
  programmingLanguage: z.string().describe('The programming language of the code.'),
  sourceStyle: z.string().describe('The source coding style (e.g., snake_case).'),
  targetStyle: z.string().describe('The target coding style (e.g., camelCase).'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type StyleConverterInput = z.infer<typeof StyleConverterInputSchema>;

const StyleConverterOutputSchema = z.object({
  convertedCode: z.string().describe('The code converted to the target style.'),
});
export type StyleConverterOutput = z.infer<typeof StyleConverterOutputSchema>;

const StyleConverterResultSchema = z.union([
    StyleConverterOutputSchema,
    z.object({ error: z.string() })
]);
export type StyleConverterResult = z.infer<typeof StyleConverterResultSchema>;


export async function convertStyle(input: StyleConverterInput): Promise<StyleConverterResult> {
  try {
    const validatedInput = StyleConverterInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);
    
    const prompt = `You are an AI code refactoring tool. Convert the given code snippet from ${validatedInput.sourceStyle} to ${validatedInput.targetStyle}.
    
    - If the style is 'readable', add whitespace and format for clarity.
    - If the style is 'compact', remove unnecessary whitespace.
    - For casing styles (snake_case, camelCase, etc.), only rename variables, functions, and other identifiers as appropriate for the language.

    Return only the converted code, without any surrounding text or explanations.

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

    const outputText = result.text;
    if (!outputText) {
      throw new Error('No converted code was generated.');
    }
    
    const trimmedOutput = outputText.trim();
    const codeBlockRegex = new RegExp("```" + validatedInput.programmingLanguage + "?([\\s\\S]*?)```");
    const match = trimmedOutput.match(codeBlockRegex);

    if (match && match[1]) {
        return { convertedCode: match[1].trim() };
    }

    return { convertedCode: trimmedOutput };

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in convertStyle flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
