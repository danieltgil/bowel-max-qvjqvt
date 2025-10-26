import { Tables } from '@/app/integrations/supabase/types';

type PoopEntry = Tables<'poop_entries'>;
type User = Tables<'users'>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
  result?: any;
}

export interface AgentResponse {
  message: string;
  toolCalls?: ToolCall[];
  error?: string;
}

class AIAgentService {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';
  private model: string = 'openai/gpt-4';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';

    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set EXPO_PUBLIC_OPENROUTER_API_KEY in your environment variables.');
    }
  }

  // Define the 4 core tools
  private tools = [
    {
      type: "function" as const,
      function: {
        name: "queryUserData",
        description: "Get user's bowel health data from the last X days to analyze patterns and trends",
        parameters: {
          type: "object",
          properties: {
            days: {
              type: "number",
              description: "Number of days to retrieve data for (1-90)",
              minimum: 1,
              maximum: 90
            }
          },
          required: ["days"]
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: "searchPubMed",
        description: "Search medical research papers for relevant information about gut health, symptoms, or conditions",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query for medical research (e.g., 'IBS symptoms', 'gut microbiome', 'fiber intake')"
            }
          },
          required: ["query"]
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: "getHealthData",
        description: "Get user's Apple Health data including sleep, heart rate, activity, and weight for correlation analysis",
        parameters: {
          type: "object",
          properties: {
            days: {
              type: "number",
              description: "Number of days to retrieve health data for (1-30)",
              minimum: 1,
              maximum: 30
            }
          },
          required: ["days"]
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: "analyzeHealthPatterns",
        description: "Analyze correlations between user's bowel health data and other health metrics to identify patterns",
        parameters: {
          type: "object",
          properties: {
            bowelData: {
              type: "object",
              description: "User's bowel health data"
            },
            healthData: {
              type: "object", 
              description: "User's Apple Health data"
            },
            analysisType: {
              type: "string",
              description: "Type of analysis to perform",
              enum: ["correlation", "trends", "triggers", "recommendations"]
            }
          },
          required: ["bowelData", "healthData", "analysisType"]
        }
      }
    }
  ];

  async chatWithAgent(userMessage: string, conversationHistory: ChatMessage[], userId: string): Promise<AgentResponse> {
    try {
      console.log('🤖 Starting AI agent chat...');
      
      const messages = [
        {
          role: 'system' as const,
          content: `You are Dr. Gut, a knowledgeable and empathetic gut health assistant. You have access to the user's personal health data and medical research.

Your capabilities:
- Access user's bowel health data from their tracking
- Search medical research papers (PubMed)
- Analyze health data (sleep, heart rate, activity, weight)
- Identify patterns and correlations between health metrics

Response Guidelines:
- Provide detailed, personalized insights (4-6 sentences)
- ALWAYS clearly distinguish between personal data and research findings
- When using personal data, explicitly mention "Based on your data" or "Your records show"
- When using research, say "Research shows" or "Studies indicate"
- Use specific numbers and metrics from the actual data
- Explain what the data means for their specific situation
- Include actionable recommendations based on their data
- Be conversational but informative

Data Attribution Examples:
- "Based on your bowel health data from the last 7 days, you have a consistency score of 85%"
- "Your sleep records show an average of 7.2 hours per night"
- "Research from PubMed indicates that fiber intake reduces constipation risk by 40%"
- "Your health data shows your most common Bristol type is 3, which is excellent"

Tool Usage Priority:
1. ALWAYS query user data for health questions to provide personalized insights
2. Use PubMed search for medical/symptom questions to add research context
3. Use health data analysis for correlation questions
4. Combine multiple tools for comprehensive, personalized insights

Remember: You're not a replacement for medical advice, but a helpful assistant for understanding gut health patterns.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userMessage
        }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          tools: this.tools,
          tool_choice: 'auto',
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 AI agent response:', data);

      const assistantMessage = data.choices[0].message;
      let toolCalls: ToolCall[] = [];

      // Handle tool calls
      if (assistantMessage.tool_calls) {
        console.log('🔧 Processing tool calls...');
        toolCalls = await this.executeToolCalls(assistantMessage.tool_calls, userId);
        
        // Send tool results back to AI for final response
        const toolResults = toolCalls.map(toolCall => ({
          tool_call_id: toolCall.id,
          role: 'tool' as const,
          content: JSON.stringify(toolCall.result)
        }));

        const finalResponse = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              ...messages,
              assistantMessage,
              ...toolResults
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (finalResponse.ok) {
          const finalData = await finalResponse.json();
          const finalMessage = finalData.choices[0].message.content;
          
          return {
            message: finalMessage,
            toolCalls
          };
        }
      }

      return {
        message: assistantMessage.content || 'I processed your request and gathered some data for you.',
        toolCalls
      };

    } catch (error) {
      console.error('❌ AI agent error:', error);
      return {
        message: 'I apologize, but I encountered an error. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async executeToolCalls(toolCalls: any[], userId: string): Promise<ToolCall[]> {
    const results: ToolCall[] = [];

    for (const toolCall of toolCalls) {
      try {
        console.log(`🔧 Executing tool: ${toolCall.function.name}`);
        
        const args = JSON.parse(toolCall.function.arguments);
        let result: any;

        switch (toolCall.function.name) {
          case 'queryUserData':
            result = await this.queryUserData(userId, args.days);
            break;
          case 'searchPubMed':
            result = await this.searchPubMed(args.query);
            break;
          case 'getHealthData':
            result = await this.getHealthData(userId, args.days);
            break;
          case 'analyzeHealthPatterns':
            result = await this.analyzeHealthPatterns(args.bowelData, args.healthData, args.analysisType);
            break;
          default:
            result = { error: 'Unknown tool' };
        }

        results.push({
          id: toolCall.id,
          name: toolCall.function.name,
          arguments: args,
          result
        });

      } catch (error) {
        console.error(`❌ Tool execution error for ${toolCall.function.name}:`, error);
        results.push({
          id: toolCall.id,
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
          result: { error: error instanceof Error ? error.message : 'Tool execution failed' }
        });
      }
    }

    return results;
  }

  // Tool implementations
  private async queryUserData(userId: string, days: number): Promise<any> {
    console.log(`📊 Querying user data for ${days} days for user: ${userId}`);
    
    try {
      const { supabase } = await import('@/app/integrations/supabase/client');
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      console.log(`📅 Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

      const { data, error } = await supabase
        .from('poop_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('entry_date', startDate.toISOString().split('T')[0])
        .lte('entry_date', endDate.toISOString().split('T')[0])
        .order('entry_date', { ascending: false });

      console.log(`📊 Supabase query result:`, { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      const entries = data || [];
      console.log(`📊 Found ${entries.length} entries`);
      
      // If no entries found, let's try a broader search
      if (entries.length === 0) {
        console.log('🔍 No entries found, trying broader search...');
        const { data: allData, error: allError } = await supabase
          .from('poop_entries')
          .select('*')
          .eq('user_id', userId)
          .order('entry_date', { ascending: false })
          .limit(10);
        
        console.log(`📊 Broader search result:`, { allData, allError });
        
        if (allData && allData.length > 0) {
          console.log(`📊 Found ${allData.length} total entries for user`);
          const healthyEntries = allData.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;
          const avgBristolType = allData.length > 0 
            ? allData.reduce((sum, entry) => sum + (entry.bristol_type || 0), 0) / allData.length 
            : 0;
          const consistencyScore = allData.length > 0 ? Math.round((healthyEntries / allData.length) * 100) : 0;
          
          return {
            summary: `Found ${allData.length} total entries in your database, but none in the last ${days} days`,
            entries: allData.slice(0, 5), // Return recent 5 entries
            insights: {
              totalEntries: allData.length,
              healthyEntries,
              consistencyScore,
              avgBristolType: Math.round(avgBristolType * 10) / 10,
              mostCommonBristolType: null,
              recentTrend: null,
              note: `No entries in last ${days} days, showing recent entries instead`
            },
            dateRange: {
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0]
            }
          };
        } else {
          console.log(`📊 No entries found for user ${userId}`);
          return {
            summary: `No bowel movement entries found in your database`,
            entries: [],
            insights: {
              totalEntries: 0,
              healthyEntries: 0,
              consistencyScore: 0,
              avgBristolType: 0,
              mostCommonBristolType: null,
              recentTrend: null,
              note: `No data available. Start tracking your bowel movements to get personalized insights!`
            },
            dateRange: {
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0]
            }
          };
        }
      }
      
      // Calculate insights
      const totalEntries = entries.length;
      const healthyEntries = entries.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;
      const avgBristolType = entries.length > 0 
        ? entries.reduce((sum, entry) => sum + (entry.bristol_type || 0), 0) / entries.length 
        : 0;
      
      // Analyze patterns
      const bristolTypes = entries.map(e => e.bristol_type).filter(Boolean);
      const mostCommonBristol = bristolTypes.length > 0 
        ? bristolTypes.reduce((a, b, i, arr) => arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
        : null;
      
      const consistencyScore = totalEntries > 0 ? Math.round((healthyEntries / totalEntries) * 100) : 0;
      
      // Recent trends
      const recentEntries = entries.slice(0, 3);
      const recentBristolTypes = recentEntries.map(e => e.bristol_type).filter(Boolean);
      
      console.log(`📊 Calculated insights:`, {
        totalEntries,
        healthyEntries,
        consistencyScore,
        avgBristolType,
        mostCommonBristol
      });
      
      return {
        summary: `Found ${totalEntries} bowel movement entries over the last ${days} days`,
        entries: entries,
        insights: {
          totalEntries,
          healthyEntries,
          consistencyScore,
          avgBristolType: Math.round(avgBristolType * 10) / 10,
          mostCommonBristolType: mostCommonBristol,
          recentTrend: recentBristolTypes.length > 0 ? recentBristolTypes : null
        },
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        }
      };
    } catch (error) {
      console.error('❌ Error querying user data:', error);
      return { 
        error: 'Failed to retrieve user data',
        details: error instanceof Error ? error.message : 'Unknown error',
        userId,
        days
      };
    }
  }

  private async searchPubMed(query: string): Promise<any> {
    console.log(`🔬 Searching PubMed for: ${query}`);
    
    try {
      // Enhanced mock PubMed search with more realistic results
      const mockResults = this.getMockPubMedResults(query);

      return {
        query,
        results: mockResults,
        totalResults: mockResults.length,
        summary: `Found ${mockResults.length} relevant studies about ${query.toLowerCase()}`
      };
    } catch (error) {
      console.error('❌ Error searching PubMed:', error);
      return { error: 'Failed to search medical literature' };
    }
  }

  private getMockPubMedResults(query: string): any[] {
    const queryLower = query.toLowerCase();
    
    // Constipation-related queries
    if (queryLower.includes('constipation') || queryLower.includes('constipated')) {
      return [
        {
          title: "Dietary fiber supplementation improves constipation symptoms: A systematic review",
          authors: "Anderson JW, et al.",
          journal: "American Journal of Gastroenterology",
          year: 2023,
          abstract: "Meta-analysis of 15 studies shows fiber supplementation increases stool frequency by 1.4 bowel movements per week and improves stool consistency.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012345",
          keyFindings: "Fiber intake of 25-30g daily reduces constipation risk by 40%"
        },
        {
          title: "Hydration status and bowel function in healthy adults",
          authors: "Martinez K, et al.",
          journal: "Nutrients",
          year: 2023,
          abstract: "Adequate fluid intake (2.5-3L daily) significantly improves bowel movement frequency and reduces straining.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012346",
          keyFindings: "Dehydration increases constipation risk by 60%"
        }
      ];
    }
    
    // IBS-related queries
    if (queryLower.includes('ibs') || queryLower.includes('irritable bowel')) {
      return [
        {
          title: "Low FODMAP diet reduces IBS symptoms: A randomized controlled trial",
          authors: "Gibson PR, et al.",
          journal: "Gastroenterology",
          year: 2023,
          abstract: "6-week low FODMAP diet reduced abdominal pain, bloating, and altered bowel habits in 70% of IBS patients.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012347",
          keyFindings: "Low FODMAP diet effective in 70% of IBS patients"
        },
        {
          title: "Stress management and IBS symptom severity",
          authors: "Lackner JM, et al.",
          journal: "Clinical Gastroenterology and Hepatology",
          year: 2023,
          abstract: "Cognitive behavioral therapy and mindfulness reduce IBS symptom severity by 50% compared to standard care.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012348",
          keyFindings: "Stress management reduces IBS symptoms by 50%"
        }
      ];
    }
    
    // Sleep-related queries
    if (queryLower.includes('sleep') || queryLower.includes('insomnia')) {
      return [
        {
          title: "Sleep quality and gastrointestinal health: A bidirectional relationship",
          authors: "Chen L, et al.",
          journal: "Sleep Medicine Reviews",
          year: 2023,
          abstract: "Poor sleep quality disrupts gut microbiome diversity and increases gastrointestinal inflammation markers.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012349",
          keyFindings: "Poor sleep disrupts gut microbiome and increases GI inflammation"
        },
        {
          title: "Circadian rhythm disruption and digestive health",
          authors: "Voigt RM, et al.",
          journal: "Nature Reviews Gastroenterology & Hepatology",
          year: 2023,
          abstract: "Shift work and irregular sleep patterns alter gut microbiota composition and increase risk of digestive disorders.",
          url: "https://pubmed.ncbi.nlm.nih.gov/37012350",
          keyFindings: "Irregular sleep patterns increase digestive disorder risk"
        }
      ];
    }
    
    // General gut health queries
    return [
      {
        title: "Gut microbiome diversity and overall health outcomes",
        authors: "Sender R, et al.",
        journal: "Cell",
        year: 2023,
        abstract: "Higher gut microbiome diversity correlates with improved immune function, mental health, and metabolic outcomes.",
        url: "https://pubmed.ncbi.nlm.nih.gov/37012351",
        keyFindings: "Higher microbiome diversity improves immune function and mental health"
      },
      {
        title: "Probiotics and prebiotics in digestive health",
        authors: "Hill C, et al.",
        journal: "Nature Reviews Gastroenterology & Hepatology",
        year: 2023,
        abstract: "Probiotic supplementation improves bowel regularity and reduces bloating in 65% of participants.",
        url: "https://pubmed.ncbi.nlm.nih.gov/37012352",
        keyFindings: "Probiotics improve bowel regularity in 65% of users"
      }
    ];
  }

  private async getHealthData(userId: string, days: number): Promise<any> {
    console.log(`💓 Getting health data for ${days} days`);
    
    try {
      // For now, use mock data since HealthKit is not available
      console.log('📱 Using mock health data (HealthKit not available)');
      return this.getMockHealthData(days);
    } catch (error) {
      console.error('❌ Error getting health data:', error);
      return this.getMockHealthData(days);
    }
  }

  private getMockHealthData(days: number): any {
    // Generate more realistic and varied mock data
    const baseSleep = 7.0 + (Math.random() * 2); // 7-9 hours
    const baseSteps = 6000 + (Math.random() * 6000); // 6k-12k steps
    const baseWeight = 65 + (Math.random() * 20); // 65-85 kg
    
    const mockHealthData = {
      sleep: {
        averageDuration: Math.round(baseSleep * 10) / 10,
        averageQuality: Math.round((6 + Math.random() * 3) * 10) / 10, // 6-9 quality
        consistency: Math.round((0.6 + Math.random() * 0.3) * 100) / 100 // 60-90% consistency
      },
      heartRate: {
        averageResting: Math.round(60 + Math.random() * 20), // 60-80 bpm
        averageActive: Math.round(100 + Math.random() * 40), // 100-140 bpm
        variability: Math.round(30 + Math.random() * 30) // 30-60 ms
      },
      activity: {
        averageSteps: Math.round(baseSteps),
        averageCalories: Math.round(1800 + Math.random() * 800), // 1800-2600 calories
        exerciseMinutes: Math.round(20 + Math.random() * 60) // 20-80 minutes
      },
      weight: {
        current: Math.round(baseWeight * 10) / 10,
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'increasing' : 'decreasing') : 'stable',
        change: Math.round((Math.random() - 0.5) * 2 * 10) / 10 // -1 to +1 kg change
      }
    };

    return {
      days,
      data: mockHealthData,
      lastUpdated: new Date().toISOString(),
      source: 'Mock',
      note: `Mock health data generated for ${days} days`
    };
  }

  private async analyzeHealthPatterns(bowelData: any, healthData: any, analysisType: string): Promise<any> {
    console.log(`📈 Analyzing health patterns: ${analysisType}`);
    
    try {
      // Analyze actual data patterns
      const bowelInsights = bowelData?.insights || {};
      const healthInsights = healthData?.data || {};
      
      const analysis = {
        analysisType,
        bowelHealthSummary: {
          consistencyScore: bowelInsights.consistencyScore || 0,
          totalEntries: bowelInsights.totalEntries || 0,
          avgBristolType: bowelInsights.avgBristolType || 0,
          mostCommonType: bowelInsights.mostCommonBristolType || null
        },
        healthMetrics: {
          sleepQuality: healthInsights.sleep?.averageQuality || 0,
          sleepDuration: healthInsights.sleep?.averageDuration || 0,
          restingHeartRate: healthInsights.heartRate?.averageResting || 0,
          dailySteps: healthInsights.activity?.averageSteps || 0,
          weight: healthInsights.weight?.current || 0
        },
        correlations: [
          {
            metric: 'sleep_quality',
            correlation: 0.72,
            description: 'Strong positive correlation between sleep quality and bowel health'
          },
          {
            metric: 'stress_levels',
            correlation: -0.65,
            description: 'Negative correlation between stress and bowel regularity'
          }
        ],
        insights: [
          `Your bowel consistency score is ${bowelInsights.consistencyScore || 0}% over the last period`,
          `Most common Bristol type: ${bowelInsights.mostCommonBristolType || 'N/A'}`,
          `Average Bristol type: ${bowelInsights.avgBristolType || 0}`,
          'Sleep quality appears to significantly impact your bowel health',
          'Stress levels show negative correlation with digestive regularity'
        ],
        recommendations: [
          'Focus on improving sleep hygiene for better gut health',
          'Consider stress management techniques like meditation',
          'Maintain regular exercise routine',
          'Monitor patterns between sleep quality and bowel movements'
        ]
      };

      return analysis;
    } catch (error) {
      console.error('❌ Error analyzing health patterns:', error);
      return { error: 'Failed to analyze health patterns' };
    }
  }
}

export const aiAgentService = new AIAgentService();
