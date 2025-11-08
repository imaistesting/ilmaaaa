import type { ProcessedContent } from '../types';

const AI_API_KEY = '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';

const AI_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export const processContent = async (content: string): Promise<ProcessedContent> => {
  if (!AI_API_KEY) return generateMockResponse(content);

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-7b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'Generate JSON: {"summary": "...", "keyPoints": ["..."], "quiz": [{"question": "...","options": ["...","...","...","..."],"correctAnswer": 0}]}'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    const raw = data.choices[0].message.content;
    const result = JSON.parse(raw);

    return result;
  } catch {
    return generateMockResponse(content);
  }
};

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
    summary:
      summary.length > 50
        ? summary
        : 'This lesson contains structured educational material.',
    keyPoints:
      keyPoints.length > 0
        ? keyPoints
        : [
            'Main concepts from the lesson content',
            'Important informational elements',
            'Core learning objectives',
            'Essential understanding points'
          ],
    quiz
  };
};
