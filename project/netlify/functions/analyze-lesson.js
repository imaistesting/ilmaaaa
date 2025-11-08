const fetch = require('node-fetch');

const MOCK_RESPONSE = {
  summary: "This lesson covers fundamental concepts that form the building blocks of understanding the subject matter.",
  keyPoints: [
    "Understanding core principles is essential for mastery",
    "Practical application reinforces theoretical knowledge",
    "Critical thinking develops through active engagement"
  ],
  quiz: [
    {
      question: "What is the primary focus of this lesson?",
      options: [
        "Building foundational understanding",
        "Advanced techniques only",
        "Historical context",
        "Future predictions"
      ],
      correctAnswer: 0
    },
    {
      question: "How can you best apply these concepts?",
      options: [
        "Memorization alone",
        "Practice and application",
        "Passive reading",
        "Avoiding challenges"
      ],
      correctAnswer: 1
    },
    {
      question: "What skill is most developed through engagement?",
      options: [
        "Speed reading",
        "Critical thinking",
        "Guessing",
        "Procrastination"
      ],
      correctAnswer: 1
    }
  ]
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { lessonText } = JSON.parse(event.body);

    if (!lessonText || lessonText.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Lesson text is required' })
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn('OPENROUTER_API_KEY not configured, using mock data');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(MOCK_RESPONSE)
      };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://netlify-lesson-bot.netlify.app',
        'X-Title': 'AI Lesson Bot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an educational assistant. Analyze lesson content and return a JSON response with: summary (string), keyPoints (array of 3-5 strings), and quiz (array of 3 objects with question, options array, and correctAnswer index). Return ONLY valid JSON, no markdown or explanation.'
          },
          {
            role: 'user',
            content: `Analyze this lesson and create a summary, key points, and quiz:\n\n${lessonText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(MOCK_RESPONSE)
      };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsedContent;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsedContent = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(MOCK_RESPONSE)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(parsedContent)
    };

  } catch (error) {
    console.error('Error processing lesson:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(MOCK_RESPONSE)
    };
  }
};
