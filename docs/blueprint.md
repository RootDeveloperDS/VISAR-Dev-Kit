# **App Name**: GeminiDevKit

## Core Features:

- Comment Enhancer: Enhance uncommented code by adding smart inline comments using Gemini tool.
- Code Comparator: Compare two code snippets and summarize their differences using Gemini tool.
- Style Converter: Convert code to a different coding style (e.g., snake_case to camelCase, compact → readable) using Gemini tool.
- Pseudocode Generator: Explain code logic in pseudocode for tutorials or documentation using Gemini tool.
- Unit Test Generator: Generate multiple choice (10 questions) unit tests for the selected programming language using Gemini tool.
- Rename Suggestion: Suggest descriptive names for bad variable or function names using Gemini tool.
- Dependency Extractor: Show only the required import statements for a given block of code using Gemini tool.
- Copy to Clipboard: Copy code snippets to the clipboard with a toast message notification.
- GEMINI API KEY HANDLING: User provides apikey in URL query (?apikey=abc123) Use user's key (priority),If not provided Fallback to default Gemini API key in .env,If invalid or quota exceeded Show toast/error alert “Invalid or expired Gemini key” Auto-detect and log which key was used in output Configurable via get_gemini_key() utility

## Style Guidelines:

- Primary color: Electric purple (#BE29EC) for a futuristic and vibrant feel.
- Background color: Very dark purple (#17051C), nearly black.
- Accent color: Fuchsia (#F02CEB), to highlight key interactive elements.
- Body and headline font: 'Space Grotesk', sans-serif.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalist, glowing icons related to code manipulation and AI tools.
- Subtle glow effects and animations on button hover and AI processing.