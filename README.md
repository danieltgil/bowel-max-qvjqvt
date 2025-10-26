# Bowel Max

A modern React Native mobile application for tracking and analyzing gut health using AI-powered stool analysis and personalized health insights.

## Overview

Bowel Max is a comprehensive gut health tracking application that leverages cutting-edge artificial intelligence to analyze stool photos, provide personalized health insights, and help users understand their digestive patterns. The app uses the Bristol Stool Scale (Types 1-7) to classify stool consistency and offers actionable recommendations based on your unique health data.

## Features

### 🤖 AI-Powered Analysis
- **Photo Analysis**: Upload photos of stool samples for instant AI analysis using Claude 4.5 Sonnet via OpenRouter
- **Bristol Stool Scale Classification**: Automatic classification into 7 types (1: severe constipation → 7: severe diarrhea)
- **Detailed Health Metrics**: Track color, texture, hydration levels, and receive AI-generated insights
- **Smart Recommendations**: Get personalized, actionable advice based on your specific patterns

### 💬 Dr. Gut AI Chat Assistant
- **Conversational AI**: Chat with Dr. Gut, your personal gut health assistant powered by GPT-4
- **Multi-Tool Agent**: AI agent with access to 4 specialized tools:
  - **Query User Data**: Analyze your bowel health history and patterns
  - **Search PubMed**: Access medical research papers and studies
  - **Get Health Data**: Integrate Apple Health data (sleep, heart rate, activity, weight)
  - **Analyze Patterns**: Correlate bowel health with other health metrics
- **Personalized Insights**: Receive detailed, data-driven answers to your gut health questions
- **Research-Backed**: Responses combine your personal data with medical research

### 📊 Advanced Insights Dashboard
- **Time-Based Analytics**: View insights for 7, 30, or 60-day periods
- **Key Metrics Tracking**:
  - Consistency Score (percentage of healthy entries)
  - Average Bristol Type
  - Daily stool frequency
  - Gut health trends over time
- **Interactive Charts**: Visualize daily stool counts with line charts
- **AI Weekly Digest**: Get AI-generated summaries of your gut health patterns
- **Pattern Recognition**: Identify correlations between lifestyle factors and bowel health
- **Comparative Analysis**: Compare current period with previous period for trend spotting

### 📅 History & Calendar
- **Calendar View**: Visual calendar showing days with logged entries
- **Entry Navigation**: Click any calendar day to view specific entries
- **Historical Data**: Access all past analyses and insights
- **Date Filtering**: Easy navigation through your health history

### 👤 User Profile & Customization
- **Health Profile**: Store age, diet type, hydration goals, and conditions
- **Dark Mode**: Full dark mode support with persistent theme preferences
- **Clean Design**: Cal AI-inspired minimal interface with card-based layouts
- **Settings Management**: Easy access to all app settings and preferences

### 📸 Custom Camera Integration
- **Native Camera**: Custom camera interface for capturing stool photos
- **Photo Quality**: Optimized image capture for accurate AI analysis
- **Privacy-First**: Photos analyzed locally or via secure API, never stored permanently

### 🎯 Onboarding Experience
- **Guided Setup**: 8-step onboarding flow to collect essential health data
- **Educational**: Learn about Bristol Stool Scale Types 3 & 4 (optimal health)
- **Personalized Plans**: App calibrates recommendations based on your profile
- **User Data Collection**:
  - Name and age
  - Diet type (fiber intake)
  - Daily water consumption
  - Gut health conditions
  - Restroom frequency
  - Health education

## Tech Stack

### Frontend
- **Framework**: React Native with Expo (v54.0.1)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with React Native
- **Icons**: SF Symbols (iOS) / Material Icons (Android)
- **Charts**: react-native-chart-kit with react-native-svg

### Backend & Services
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **AI Models**:
  - Claude 4.5 Sonnet (image analysis & health insights)
  - GPT-4 (conversational AI agent)
- **AI Provider**: OpenRouter API
- **Image Processing**: expo-image-picker, expo-camera

### State & Storage
- **State Management**: React Context API (UserContext, ThemeContext)
- **Local Storage**: AsyncStorage for persistent data
- **Theme System**: Custom dark/light mode with system detection

### Development Tools
- **Type Safety**: TypeScript with strict mode
- **Environment**: dotenv for configuration
- **Version Control**: Git with GitHub

## Project Structure

```
app/
├── (tabs)/                    # Tab-based navigation screens
│   ├── (home)/
│   │   └── index.tsx         # Home dashboard with recent entries
│   ├── history.tsx           # Calendar view with entry navigation
│   ├── insights.tsx          # Advanced analytics dashboard
│   └── profile.tsx           # User settings and preferences
├── analysis.tsx              # AI analysis results with editing
├── camera.tsx                # Custom camera for photo capture
├── chat.tsx                  # Dr. Gut AI chat interface
├── onboarding.tsx            # 8-step user onboarding flow
├── index.tsx                 # App entry point
├── _layout.tsx               # Root layout with providers
└── integrations/
    └── supabase/
        ├── client.ts         # Supabase client configuration
        └── types.ts          # Database type definitions

components/
├── AIInsightsDisplay.tsx     # AI-generated insights component
├── BristolChart.tsx          # Bristol Stool Scale visual reference
├── EditableResultCard.tsx    # Editable analysis result cards
├── FloatingTabBar.tsx        # Custom tab bar (Android/Web)
├── HealthOverviewCard.tsx    # Health metrics summary
└── IconSymbol.tsx            # Cross-platform icon component

services/
├── aiService.ts              # AI health insights analysis
├── aiAgentService.ts         # Dr. Gut chat agent with tools
└── healthKitService.ts       # Apple Health integration (future)

contexts/
├── UserContext.tsx           # User authentication & data
├── ThemeContext.tsx          # Dark/light mode theme
└── WidgetProvider.tsx        # Widget data provider

utils/
└── imageAnalysis.ts          # Stool photo AI analysis

styles/
└── commonStyles.ts           # Global color theme system
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bowel-max-qvjqvt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_OPENROUTER_API_KEY=your-openrouter-api-key
```

5. Start the development server:
```bash
npm start
```

## API Configuration

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anonymous key from Settings > API
3. Set up the following tables:
   - `users`: Store user profiles and health information
   - `poop_entries`: Store stool analysis entries

### OpenRouter API

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Generate an API key from the dashboard
3. Add the key to your `.env` file

## Database Schema

### Users Table (`users`)
```sql
id                      UUID PRIMARY KEY
name                    TEXT NOT NULL
age                     INTEGER
diet_type               TEXT (Low Fiber, Medium Fiber, Balanced, High Fiber)
hydration_glasses       INTEGER (glasses per day)
has_conditions          BOOLEAN
conditions_description  TEXT (optional)
restroom_frequency      TEXT (Less than once, 1-2 times, 3+ times per day)
created_at              TIMESTAMP WITH TIME ZONE
updated_at              TIMESTAMP WITH TIME ZONE
```

### Poop Entries Table (`poop_entries`)
```sql
id                 UUID PRIMARY KEY
user_id            UUID REFERENCES users(id)
entry_date         DATE NOT NULL
bristol_type       INTEGER (1-7)
color              TEXT (Brown, Dark Brown, Light Brown, Green, Yellow, Black, Red)
texture            TEXT (Hard, Normal, Soft, Liquid, Mushy)
hydration_level    TEXT (Well Hydrated, Adequate, Dehydrated, Over-hydrated)
ai_insight         TEXT (AI-generated actionable advice)
photo_url          TEXT (optional)
notes              TEXT (optional user notes)
created_at         TIMESTAMP WITH TIME ZONE
updated_at         TIMESTAMP WITH TIME ZONE
```

### Indexes
- `poop_entries.user_id` - Fast user data retrieval
- `poop_entries.entry_date` - Chronological sorting
- `users.id` - Primary key lookups

## Features in Detail

### Bristol Stool Scale Classification

The app uses the medical Bristol Stool Scale to classify stool into 7 types:

| Type | Description | Health Indicator |
|------|-------------|------------------|
| **Type 1** | Hard, separate lumps like nuts | Severe constipation |
| **Type 2** | Sausage-shaped but lumpy | Mild constipation |
| **Type 3** | Sausage with cracks on surface | **Normal (Ideal)** ✓ |
| **Type 4** | Smooth, soft sausage or snake | **Normal (Ideal)** ✓ |
| **Type 5** | Soft blobs with clear-cut edges | Lacks fiber |
| **Type 6** | Fluffy pieces with ragged edges | Mild diarrhea |
| **Type 7** | Watery, no solid pieces | Severe diarrhea |

### AI Photo Analysis (Claude 4.5 Sonnet)

The AI analyzes uploaded photos to determine:
- ✓ **Validity Check**: Confirms image is actually stool (not food/objects)
- ✓ **Bristol Classification**: Assigns Type 1-7 based on visual analysis
- ✓ **Color Assessment**: Identifies color (brown, dark, light, green, yellow, black, red)
- ✓ **Texture Evaluation**: Determines texture (hard, normal, soft, liquid, mushy)
- ✓ **Hydration Analysis**: Estimates hydration level (well-hydrated, adequate, dehydrated, over-hydrated)
- ✓ **AI Insights**: Provides 1-2 sentence actionable health recommendations

### AI Chat Agent (Dr. Gut)

Dr. Gut is an advanced AI agent with specialized capabilities:

**Tool 1: Query User Data**
- Retrieves bowel health data from last 1-90 days
- Calculates consistency scores, patterns, and trends
- Identifies most common Bristol types
- Provides detailed metrics on your personal data

**Tool 2: Search PubMed**
- Searches medical research papers
- Provides evidence-based information
- Covers topics: IBS, constipation, gut microbiome, fiber, etc.
- Returns relevant studies with key findings

**Tool 3: Get Health Data**
- Integrates Apple Health metrics (planned)
- Tracks sleep, heart rate, activity, weight
- Correlates health data with bowel patterns

**Tool 4: Analyze Health Patterns**
- Identifies correlations between metrics
- Analyzes lifestyle impacts on gut health
- Provides trend analysis and predictions
- Generates comprehensive health reports

## Design Philosophy

Bowel Max follows a clean, minimal design inspired by Cal AI and modern health apps:
- **Color Scheme**: Simple black/white with gray accents, mint green highlights
- **Layout**: Card-based design with generous spacing and clear hierarchy
- **Typography**: Bold headers (800 weight), clean body text, clear data visualization
- **Navigation**: Bottom tab bar with 4 main sections (Home, History, Insights, Profile)
- **Dark Mode**: Full support with carefully chosen colors for readability
- **Accessibility**: High contrast ratios, clear touch targets, readable fonts
- **Consistency**: Unified design language across all screens

### Design Principles
1. **Clarity First**: Health data presented clearly without clutter
2. **Privacy Focus**: Reassuring design that emphasizes data security
3. **Educational**: Teach users about gut health through the interface
4. **Actionable**: Every insight includes clear next steps
5. **Encouraging**: Positive reinforcement for healthy patterns

## Privacy & Security

### Data Protection
- **Photo Privacy**: Photos analyzed via secure API, not stored permanently
- **Encryption**: All user data encrypted at rest in Supabase
- **API Security**: API keys stored in environment variables (.env)
- **No Sharing**: User data never shared with third parties
- **Local Storage**: Sensitive data cached locally using AsyncStorage

### Compliance
- **HIPAA Considerations**: Designed with health data privacy in mind
- **User Control**: Users can delete their data anytime
- **Transparency**: Clear privacy notices during onboarding
- **Minimal Data**: Only collect essential health information

### Security Best Practices
- Environment variables for all API keys
- Secure Supabase Row Level Security (RLS)
- No hardcoded credentials in codebase
- HTTPS for all API communications
- Regular security audits

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Roadmap

### Planned Features
- [ ] Apple Health integration (sleep, activity, heart rate correlation)
- [ ] Export health reports (PDF)
- [ ] Medication tracking and correlation
- [ ] Food diary with symptom tracking
- [ ] Gut health score trending over time
- [ ] Community insights (anonymized data)
- [ ] Reminders for tracking
- [ ] Multi-language support
- [ ] Web dashboard
- [ ] Apple Watch complications

### Future AI Enhancements
- [ ] Predictive analytics for gut health trends
- [ ] Personalized meal recommendations
- [ ] Symptom pattern recognition
- [ ] Integration with wearable devices
- [ ] Voice-based logging

## Support

For issues, questions, or feature requests:
- **Email**: support@bowelmax.app
- **GitHub Issues**: [Create an issue](https://github.com/your-org/bowel-max/issues)
- **Documentation**: Check the `/docs` folder for detailed guides

## Team

Developed with ❤️ by the Bowel Max team:
- Focus on digestive health awareness
- Powered by cutting-edge AI technology
- Committed to user privacy and data security

## Acknowledgments

- Bristol Stool Scale created by Dr. Ken Heaton at the University of Bristol
- AI analysis powered by Anthropic's Claude 4.5 Sonnet
- Design inspiration from Cal AI and modern health tracking apps
