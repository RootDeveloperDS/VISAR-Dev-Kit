'use server';

export async function getApiKey(userKey?: string | null): Promise<string> {
    if (userKey) {
        console.log("Using user-provided Gemini API key.");
        return userKey;
    }
    
    const envKey = process.env.GOOGLE_GENAI_API_KEY;
    if (envKey) {
        console.log("Using Gemini API key from environment variables.");
        return envKey;
    }
    
    console.error("No Gemini API key provided. Please provide one in the URL (?apikey=...) or set GOOGLE_GENAI_API_KEY environment variable.");
    throw new Error("Gemini API key not found.");
}
