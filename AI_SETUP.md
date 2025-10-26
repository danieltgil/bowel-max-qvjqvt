# AI Insights Setup Guide

## 🚀 Quick Setup Steps

### 1. Get OpenRouter API Key
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Go to "Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-or-...`)

### 2. Add Environment Variable
Create a `.env` file in your project root:
```
EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-your-key-here
```

### 3. Install Dependencies
```bash
npm install openai
```

### 4. Test the Integration
The AI service will automatically:
- Use Claude 3.5 Sonnet for analysis
- Provide mock insights if no API key is set
- Fall back gracefully on errors

## 💰 Cost Estimation

**Claude 3.5 Sonnet Pricing:**
- Input: ~$3 per 1M tokens
- Output: ~$15 per 1M tokens

**Typical Usage per Analysis:**
- Input: ~500 tokens (user data + prompt)
- Output: ~200 tokens (insights response)
- **Cost per analysis: ~$0.002** (less than 1 cent!)

## 🔧 Model Options

You can easily switch models by changing the `model` property in `aiService.ts`:

```typescript
// Current (recommended)
private model: string = 'anthropic/claude-3.5-sonnet';

// Alternative options:
private model: string = 'openai/gpt-4o-mini';        // Faster, cheaper
private model: string = 'openai/gpt-4o';             // Most advanced
private model: string = 'google/gemini-pro';         // Google's model
```

## 🛡️ Privacy & Safety

- **No data retention**: OpenRouter offers zero data retention routing
- **Health-focused**: Prompts are designed for health insights only
- **No medical advice**: Always recommends consulting professionals
- **Secure**: API keys are environment variables only

## 📊 Expected AI Output

The AI will analyze your bowel health data and provide:

1. **Summary**: Overall health assessment
2. **Patterns**: Specific trends it identifies
3. **Recommendations**: Actionable lifestyle tips
4. **Concerns**: Red flags to watch for
5. **Positive Trends**: Celebrating improvements

Example output:
```json
{
  "summary": "Your bowel health shows good consistency with 75% healthy movements. Your hydration tracking is excellent and correlates well with your regular patterns.",
  "patterns": [
    "Consistent Bristol type 3-4 stools (ideal range)",
    "Better hydration on weekdays vs weekends",
    "More regular morning movements"
  ],
  "recommendations": [
    "Maintain your current 7-glass hydration goal",
    "Consider weekend hydration reminders",
    "Keep up the excellent tracking habit"
  ],
  "concerns": [],
  "positiveTrends": [
    "Consistency improved 10% this month",
    "Perfect tracking streak of 30 days"
  ]
}
```

## 🚨 Troubleshooting

**If you get API errors:**
1. Check your API key is correct
2. Ensure you have credits in your OpenRouter account
3. Check the console for specific error messages

**If insights aren't showing:**
1. The service will show mock insights without an API key
2. Check the console logs for debugging info
3. Make sure you have bowel movement data to analyze

## 🎯 Next Steps

1. Set up your OpenRouter account and API key
2. Add the environment variable
3. Test with your existing bowel movement data
4. Customize the AI prompts if needed
5. Add the AI insights UI to your insights page
