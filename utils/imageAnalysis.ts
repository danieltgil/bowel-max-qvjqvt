/**
 * Image Analysis Service using Claude 4.5 Sonnet via OpenRouter
 * Compares uploaded images against the Bristol Stool Chart
 */

import * as FileSystem from 'expo-file-system/legacy';

// TODO: Replace with a valid OpenRouter API key if this one is expired
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const CLAUDE_MODEL = "anthropic/claude-sonnet-4.5";

export interface AnalysisResult {
  isPoop: boolean;
  bristol_type: number | null;
  color: string | null;
  texture: string | null;
  hydration_level: string | null;
  ai_insight?: string;
  analysis?: any;
}

export async function analyzeStoolImage(imageUri: string): Promise<AnalysisResult> {
  try {
    // For React Native, use expo-file-system to read the image
    // Read file as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Determine image format
    const imageFormat = imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';

    console.log('Making API call to OpenRouter with model:', CLAUDE_MODEL);
    console.log('API Key starts with:', OPENROUTER_API_KEY.substring(0, 10));

    const headers = {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://bowel-max.app',
      'X-Title': 'Bowel Max',
      'Content-Type': 'application/json',
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/${imageFormat};base64,${base64Image}`,
                },
              },
              {
                type: "text",
                text: `You are a medical analysis assistant specializing in bowel health. 

Analyze this image and compare it to the Bristol Stool Scale (types 1-7):

**Type 1:** Hard, separate lumps like nuts - SEVERE CONSTIPATION
**Type 2:** Sausage-shaped but lumpy - MILD CONSTIPATION  
**Type 3:** Sausage with cracks on its surface - NORMAL (Ideal)
**Type 4:** Smooth, soft sausage or snake - NORMAL (Ideal)
**Type 5:** Soft blobs with clear-cut edges - LACKS FIBER
**Type 6:** Fluffy pieces with ragged edges - MILD DIARRHEA
**Type 7:** Watery, no solid pieces - SEVERE DIARRHEA

CRITICAL: First determine if this is actually human stool/feces. If it's food, objects, or clearly not poop, you MUST return {"isPoop": false}.

If it IS poop, analyze and return ONLY a valid JSON object in this EXACT format:
{
  "isPoop": true,
  "bristol_type": <number 1-7>,
  "color": "Brown" OR "Dark Brown" OR "Light Brown" OR "Green" OR "Yellow" OR "Black" OR "Red",
  "texture": "Hard" OR "Normal" OR "Soft" OR "Liquid" OR "Mushy",
  "hydration_level": "Well Hydrated" OR "Adequate" OR "Dehydrated" OR "Over-hydrated",
  "ai_insight": "<concise actionable advice on what to do and what this may mean>"
}

IMPORTANT for ai_insight field:
- Keep it to 1-2 sentences maximum
- Focus on actionable steps and what this MAY signify
- DO NOT summarize or repeat the bristol type, color, texture, or hydration
- Only provide forward-looking advice and potential health implications

Choose the BEST matching option from the choices above for each field.

ONLY return valid JSON, no other text.`,
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`OpenRouter API error: ${response.status} - ${response.statusText}. Body: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('No content in response:', data);
      throw new Error('No response from AI');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const result: AnalysisResult = JSON.parse(jsonMatch[0]);

    // Validate the result
    if (!result.isPoop) {
      return {
        isPoop: false,
        bristol_type: null,
        color: null,
        texture: null,
        hydration_level: null,
        ai_insight: 'Please upload an actual stool photo for analysis',
      };
    }

    // Ensure bristol_type is valid (1-7)
    if (result.bristol_type && (result.bristol_type < 1 || result.bristol_type > 7)) {
      result.bristol_type = 4; // Default to normal
    }

    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

