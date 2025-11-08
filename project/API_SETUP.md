# Ima AI - API Configuration Guide

## Quick Start (Demo Mode)

The application works out of the box in **demo mode** without any API key. It will generate mock summaries and quizzes based on your lesson content.

## Setting Up Real AI Processing

To enable real AI-powered content processing with OpenAI:

### Step 1: Get Your OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy your API key (it starts with `sk-...`)

### Step 2: Add Your API Key to the Code

Open the file: `src/services/aiService.ts`

Find this line near the top of the file (around line 15):

```typescript
const AI_API_KEY = 'your-api-key-here';
```

Replace `'your-api-key-here'` with your actual API key:

```typescript
const AI_API_KEY = 'sk-your-actual-api-key-goes-here';
```

### Step 3: Save and Restart

1. Save the file
2. The application will automatically use the OpenAI API for processing

## How It Works

- **With API Key**: Uses OpenAI's GPT-3.5 Turbo to generate intelligent summaries, key points, and quiz questions
- **Without API Key**: Uses built-in smart text processing to create summaries and quizzes from your content

## Features

✅ Paste any lesson text or PDF content
✅ Get AI-generated summary
✅ Extract key learning points
✅ Take interactive quizzes
✅ View detailed results with correct answers
✅ Responsive design works on all devices

## File Structure

```
src/
├── App.tsx              - Main application component
├── components/
│   ├── Header.tsx       - Logo and tagline
│   ├── ContentInput.tsx - Text input area
│   ├── Results.tsx      - Summary and key points display
│   └── Quiz.tsx         - Interactive quiz component
├── services/
│   └── aiService.ts     - AI processing (EDIT API KEY HERE)
└── types/
    └── index.ts         - TypeScript type definitions
```

## Security Note

⚠️ **Important**: Never commit your API key to version control (Git). For production applications, use environment variables instead of hardcoding API keys.

## Need Help?

- The code includes detailed comments explaining each part
- All components are well-documented
- Check `src/services/aiService.ts` for AI configuration options
