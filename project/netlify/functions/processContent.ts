import type { Handler } from '@netlify/functions';

type ProcessedContent = {
  summary: string;
  keyPoints: string[];
  quiz: { question: string; options: string[]; correctAnswer: number }[];
};

const AI_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const generateMockResponse = (content: string): ProcessedContent => {
  const wordCount = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const summary = sentences.slice(0, 3).join('. ') + '.';
  const keyPoints = sentences
    .slice(0, 5)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 4);

  const quiz = [
    {
      question: 'What is the main topic of this lesson?',
      options: [
        'The primary subject discussed in the content',
        'An unrelated topic',
        'A secondary detail',
        'None of the above'
      ],
      correctAnswer: 0
    },
    {
      question: 'Which statement aligns with the content?',
      options: [
        keyPoints[0] || 'The lesson covers core ideas',
        'Contradictory information',
        'Unrelated claim',
        'Irrelevant statement'
      ],
      correctAnswer: 0
    },
    {
      question: 'Approximate word count?',
      options: [
        `Around ${wordCount} words`,
        'Less than 10 words',
        'More than 10,000 words',
        'Exactly 500 words'
      ],
      correctAnswer: 0
    }
  ];

  return {
    summary: summary.length > 50 ? summary : 'This lesson contains structured educational material.',
    keyPoints: keyPoints.length > 0 ? keyPoints : [
      'Main concepts from the lesson content',
      'Important informational elements',
      'Core learning objectives',
      'Essential understanding points'
    ],
    quiz
  };
};

export const handler: Handler = async (event) => {
  try {
    const { content } = JSON.parse(event.body || '{}');

    if (!AI_API_KEY) return { statusCode: 200, body: JSON.stringify(generateMockResponse(content)) };

    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-7b-instruct',
        messages: [
          { role: 'system', content: 'Generate JSON: {"summary": "...", "keyPoints": ["..."], "quiz": [{"question": "...","options": ["...","...","...","..."],"correctAnswer": 0}]}' },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    return { statusCode: 200, body: JSON.stringify(parsedContent) };
  } catch (err) {
    console.error('Error processing content:', err);
    return { statusCode: 200, body: JSON.stringify(generateMockResponse('')) };
  }
};
