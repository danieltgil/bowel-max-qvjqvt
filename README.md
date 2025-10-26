# Bowel Max

A modern React Native mobile application for tracking and analyzing gut health using AI-powered stool analysis.

## Overview

Bowel Max is a comprehensive gut health tracking application that leverages artificial intelligence to analyze stool photos and provide personalized health insights. The app uses the Bristol Stool Scale (Types 1-7) to classify stool consistency and offers actionable recommendations based on your digestive patterns.

## Features

### Core Functionality
- **AI-Powered Analysis**: Upload photos of stool samples for instant AI analysis using Claude 4.5 Sonnet
- **Bristol Stool Scale Classification**: Automatic classification into 7 types, from severe constipation to diarrhea
- **Detailed Health Metrics**: Track color, texture, hydration levels, and receive personalized insights
- **History Tracking**: Calendar view showing all logged entries with easy navigation
- **Health Profile**: Maintain personal health data including diet, hydration, and restroom frequency

### User Experience
- **Onboarding Flow**: Comprehensive questionnaire to calibrate personalized recommendations
- **Dark Mode Support**: Full dark mode theme with persistent preferences
- **Insights Dashboard**: View weekly digests, key metrics, and health recommendations
- **Privacy First**: All photos are analyzed securely and never shared

## Tech Stack

- **Framework**: React Native with Expo (v54.0.1)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude 4.5 Sonnet via OpenRouter API
- **State Management**: React Context API
- **Storage**: AsyncStorage for local persistence
- **UI**: React Native components with custom theming

## Project Structure

```
app/
├── (tabs)/              # Tab-based navigation screens
│   ├── (home)/         # Home dashboard
│   ├── history.tsx     # Calendar and entry history
│   ├── insights.tsx    # Analytics and recommendations
│   └── profile.tsx     # User profile and settings
├── analysis.tsx        # AI analysis results screen
├── camera.tsx          # Custom camera interface
├── onboarding.tsx      # User registration flow
└── integrations/
    └── supabase/       # Database client and types

components/             # Reusable UI components
contexts/              # React Context providers
├── UserContext.tsx    # User state management
└── ThemeContext.tsx   # Dark mode theme management

utils/
└── imageAnalysis.ts   # AI image analysis service

styles/
└── commonStyles.ts    # Global color definitions
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

### Users Table
- `id`: UUID (primary key)
- `name`: Text
- `age`: Integer
- `diet_type`: Text
- `hydration_glasses`: Integer
- `has_conditions`: Boolean
- `conditions_description`: Text
- `restroom_frequency`: Text
- `created_at`: Timestamp

### Poop Entries Table
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key)
- `entry_date`: Timestamp
- `bristol_type`: Integer (1-7)
- `color`: Text
- `texture`: Text
- `hydration_level`: Text
- `ai_insight`: Text
- `photo_url`: Text
- `created_at`: Timestamp

## Features in Detail

### Bristol Stool Scale

The app uses the medical Bristol Stool Scale to classify stool:

- **Type 1**: Hard, separate lumps - Severe constipation
- **Type 2**: Sausage-shaped but lumpy - Mild constipation
- **Type 3**: Sausage with cracks - Normal (Ideal)
- **Type 4**: Smooth, soft sausage - Normal (Ideal)
- **Type 5**: Soft blobs with clear edges - Lacks fiber
- **Type 6**: Fluffy pieces with ragged edges - Mild diarrhea
- **Type 7**: Watery, no solid pieces - Severe diarrhea

### AI Analysis

The AI analyzes uploaded photos to determine:
- Whether the image is actually stool
- Bristol Stool Scale classification
- Color assessment
- Texture evaluation
- Hydration level indicators
- Personalized health insights and recommendations

## Design Philosophy

Bowel Max follows a clean, minimal design inspired by modern health apps:
- Simple black and gray color scheme
- Card-based layouts
- Clear typography and spacing
- Intuitive navigation
- Accessible dark mode

## Privacy & Security

- All photos are analyzed client-side or via secure API
- No photos are stored or shared with third parties
- User data is encrypted in Supabase
- API keys are stored in environment variables
- Full compliance with health data privacy standards

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

## Support

For issues or questions, please contact the development team.

## Acknowledgments

- Bristol Stool Scale created by Dr. Ken Heaton at the University of Bristol
- AI analysis powered by Anthropic's Claude 4.5 Sonnet
- Design inspiration from Cal AI and modern health tracking apps
