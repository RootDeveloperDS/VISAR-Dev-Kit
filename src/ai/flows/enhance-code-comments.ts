'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getApiKey } from '@/lib/gemini';

const EnhanceCodeCommentsInputSchema = z.object({
  code: z.string().describe('The code to be enhanced with inline comments.'),
  programmingLanguage: z.string().describe('The programming language of the code.'),
  apiKey: z.string().optional().describe('Gemini API Key.'),
});
export type EnhanceCodeCommentsInput = z.infer<typeof EnhanceCodeCommentsInputSchema>;

const EnhanceCodeCommentsOutputSchema = z.object({
  enhancedCode: z.string().describe('The code enhanced with inline comments.'),
});
export type EnhanceCodeCommentsOutput = z.infer<typeof EnhanceCodeCommentsOutputSchema>;

const EnhanceCodeCommentsResultSchema = z.union([
    EnhanceCodeCommentsOutputSchema,
    z.object({ error: z.string() })
]);
export type EnhanceCodeCommentsResult = z.infer<typeof EnhanceCodeCommentsResultSchema>;


export async function enhanceCodeComments(input: EnhanceCodeCommentsInput): Promise<EnhanceCodeCommentsResult> {
  try {
    const validatedInput = EnhanceCodeCommentsInputSchema.parse(input);
    const key = await getApiKey(validatedInput.apiKey);

    const prompt = `You are an AI code assistant that enhances code by adding inline comments to explain its functionality.

    Given the following code snippet and its programming language, add inline comments to explain the code's functionality.
    The comments should be concise and helpful for understanding the code.
    Return only the enhanced code with inline comments, without any surrounding text or explanations.
  
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
      throw new Error('No enhanced code was generated.');
    }

    const trimmedOutput = outputText.trim();
    const codeBlockRegex = new RegExp("```" + validatedInput.programmingLanguage + "?([\\s\\S]*?)```");
    const match = trimmedOutput.match(codeBlockRegex);

    if (match && match[1]) {
        return { enhancedCode: match[1].trim() };
    }

    return { enhancedCode: trimmedOutput };

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in enhanceCodeComments flow:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
