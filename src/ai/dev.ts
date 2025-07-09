import { config } from 'dotenv';
config();

import '@/ai/flows/rename-suggestion.ts';
import '@/ai/flows/enhance-code-comments.ts';
import '@/ai/flows/code-comparator.ts';
import '@/ai/flows/pseudocode-generator.ts';
import '@/ai/flows/style-converter.ts';
import '@/ai/flows/unit-test-generator.ts';
import '@/ai/flows/dependency-extractor.ts';
