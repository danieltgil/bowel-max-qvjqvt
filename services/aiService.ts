import { Tables } from '@/app/integrations/supabase/types';

type PoopEntry = Tables<'poop_entries'>;
type User = Tables<'users'>;

export interface AIInsight {
  summary: string;
  patterns: string[];
  recommendations: string[];
  concerns: string[];
  positiveTrends: string[];
}

export interface AIAnalysisData {
  user: User;
  entries: PoopEntry[];
  timePeriod: string;
  insights: {
    consistencyScore: number;
    totalEntries: number;
    avgBristolType: number;
    healthyEntries: number;
  };
}

class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';
  private model: string = 'anthropic/claude-3.5-sonnet';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';

    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set EXPO_PUBLIC_OPENROUTER_API_KEY in your environment variables.');
    }
  }

  async analyzeBowelHealth(data: AIAnalysisData): Promise<AIInsight> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const prompt = this.buildAnalysisPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://your-app.com', // Optional: for tracking
          'X-Title': 'Bowel Health Insights App', // Optional: for tracking
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful health assistant specializing in digestive health and bowel movement analysis. Provide clear, actionable insights based on the data provided. Always recommend consulting healthcare professionals for medical concerns.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.3, // Lower temperature for more consistent health advice
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from OpenRouter API');
      }

      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  private buildAnalysisPrompt(data: AIAnalysisData): string {
    const { user, entries, timePeriod, insights } = data;
    
    const recentEntries = entries.slice(-10); // Last 10 entries for detailed analysis
    
    return `
Analyze this bowel health data for a ${user.age}-year-old user named ${user.name}:

USER PROFILE:
- Age: ${user.age}
- Diet Type: ${user.diet_type}
- Hydration Target: ${user.hydration_glasses} glasses/day
- Restroom Frequency: ${user.restroom_frequency}
- Has Conditions: ${user.has_conditions ? 'Yes' : 'No'}

TIME PERIOD: ${timePeriod}

OVERALL METRICS:
- Total Entries: ${insights.totalEntries}
- Consistency Score: ${insights.consistencyScore}%
- Average Bristol Type: ${insights.avgBristolType.toFixed(1)}
- Healthy Entries: ${insights.healthyEntries}/${insights.totalEntries}

RECENT ENTRIES (Last 10):
${recentEntries.map(entry => 
  `- Date: ${entry.entry_date}, Bristol: ${entry.bristol_type}, Color: ${entry.color || 'N/A'}, Texture: ${entry.texture || 'N/A'}, Notes: ${entry.notes || 'None'}`
).join('\n')}

Please provide a comprehensive analysis in the following JSON format:
{
  "summary": "Brief 2-3 sentence overview of their bowel health",
  "patterns": ["Pattern 1", "Pattern 2", "Pattern 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "concerns": ["Any concerns or red flags"],
  "positiveTrends": ["Positive trends or improvements"]
}

Focus on:
1. Bristol Stool Scale patterns (types 3-4 are ideal, 1-2 indicate constipation, 5-7 indicate diarrhea)
2. Consistency trends over time and frequency patterns
3. Color and texture patterns that might indicate health issues
4. Actionable lifestyle recommendations (diet, fiber, exercise, stress management)
5. When to consult a healthcare provider (persistent issues, sudden changes)

Guidelines:
- Keep recommendations practical and encouraging
- Avoid medical diagnoses or treatments
- Focus on lifestyle factors that can improve bowel health
- Be specific about what patterns you observe
- Suggest concrete actions users can take
- Always recommend professional consultation for persistent concerns
    `.trim();
  }

  private parseAIResponse(response: string): AIInsight {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'Analysis completed',
          patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
          positiveTrends: Array.isArray(parsed.positiveTrends) ? parsed.positiveTrends : [],
        };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    // Fallback if JSON parsing fails
    return {
      summary: response.substring(0, 200) + '...',
      patterns: ['Pattern analysis unavailable'],
      recommendations: ['Recommendations unavailable'],
      concerns: ['Analysis incomplete'],
      positiveTrends: ['Trend analysis unavailable'],
    };
  }

  // Mock function for testing without API key
  async getMockInsights(data: AIAnalysisData): Promise<AIInsight> {
    const { insights } = data;
    
    return {
      summary: `Based on your ${insights.totalEntries} entries, your bowel health shows ${insights.consistencyScore > 70 ? 'good' : 'room for improvement'} consistency. Your Bristol Stool Scale average of ${insights.avgBristolType.toFixed(1)} indicates ${insights.avgBristolType >= 3 && insights.avgBristolType <= 4 ? 'healthy' : 'suboptimal'} bowel function.`,
      patterns: [
        insights.avgBristolType < 3 ? 'Tendency toward harder stools (constipation)' : 
        insights.avgBristolType > 4 ? 'Tendency toward looser stools (diarrhea)' : 
        'Good consistency range (Bristol 3-4)',
        insights.totalEntries > 20 ? 'Good tracking consistency' : 'Limited data for patterns',
        insights.consistencyScore > 70 ? 'Consistent healthy bowel movements' : 'Inconsistent bowel patterns'
      ],
      recommendations: [
        insights.consistencyScore < 70 ? 'Consider adding more fiber-rich foods to your diet' : 'Maintain your current healthy diet',
        insights.avgBristolType < 3 ? 'Try gentle exercise and increase water intake to promote regularity' : 'Continue current routine',
        insights.avgBristolType > 4 ? 'Consider reducing stress and avoiding trigger foods' : 'Keep up the good work'
      ],
      concerns: insights.avgBristolType < 2 || insights.avgBristolType > 6 ? 
        ['Consider consulting a healthcare provider about stool consistency'] : [],
      positiveTrends: [
        insights.healthyEntries > insights.totalEntries * 0.7 ? 'Good consistency maintenance' : '',
        insights.totalEntries > 10 ? 'Excellent tracking habit' : '',
        insights.consistencyScore > 70 ? 'Strong bowel health patterns' : ''
      ].filter(Boolean)
    };
  }
}

export const aiService = new AIService();
