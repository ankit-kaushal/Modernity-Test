import { ModernityLevel, ModernityAnalysis } from '@/types/question';

// Map modernity levels to scores
const modernityScores: Record<ModernityLevel, number> = {
  ultra_modern: 100,
  modern: 75,
  moderately_modern: 50,
  traditional: 25,
  very_traditional: 0,
};

/**
 * Analyze modernity using Hugging Face Inference API (Free)
 * Get your free API key from: https://huggingface.co/settings/tokens
 */
async function analyzeWithHuggingFace(
  question: string,
  answer: string
): Promise<ModernityAnalysis> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('Hugging Face API key not configured');
  }

  const prompt = `Analyze how modern someone is based on their answer.

Question: "${question}"
Answer: "${answer}"

Determine modernity level considering:
- Use of modern technology, tools, or methods
- Adoption of contemporary trends and practices
- Preference for innovative vs traditional approaches

Respond with ONLY valid JSON in this exact format:
{
  "level": "ultra_modern" | "modern" | "moderately_modern" | "traditional" | "very_traditional",
  "score": <number 0-100>,
  "reasoning": "<brief explanation>"
}

Levels:
- ultra_modern: Cutting edge, latest trends, most advanced (100)
- modern: Current and up-to-date (75)
- moderately_modern: Mix of modern and traditional (50)
- traditional: Prefers older, established methods (25)
- very_traditional: Very old-fashioned, resistant to change (0)

Return ONLY the JSON object, no other text.`;

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    let text = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (data.generated_text) {
      text = data.generated_text;
    } else if (typeof data === 'string') {
      text = data;
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as ModernityAnalysis;
    return normalizeAnalysis(analysis);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}

/**
 * Analyze modernity using Groq API (Free tier available)
 * Get your free API key from: https://console.groq.com/keys
 */
async function analyzeWithGroq(
  question: string,
  answer: string
): Promise<ModernityAnalysis> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const prompt = `You are analyzing how modern someone is based on their answer to a question.

Question: "${question}"
Answer: "${answer}"

Based on this answer, determine how modern this person is. Consider:
- Use of modern technology, tools, or methods
- Adoption of contemporary trends and practices
- Preference for innovative vs traditional approaches

Respond with ONLY a JSON object in this exact format:
{
  "level": "ultra_modern" | "modern" | "moderately_modern" | "traditional" | "very_traditional",
  "score": <number between 0 and 100>,
  "reasoning": "<brief explanation>"
}

The levels mean:
- ultra_modern: Cutting edge, latest trends, most advanced
- modern: Current and up-to-date
- moderately_modern: Mix of modern and traditional
- traditional: Prefers older, established methods
- very_traditional: Very old-fashioned, resistant to change

Return ONLY the JSON, no other text.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing modernity levels. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('No response from Groq');
    }

    const analysis = JSON.parse(text) as ModernityAnalysis;
    return normalizeAnalysis(analysis);
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

/**
 * Normalize and validate the analysis response
 */
function normalizeAnalysis(analysis: any): ModernityAnalysis {
  // Validate and normalize the response
  if (!modernityScores[analysis.level as ModernityLevel]) {
    analysis.level = 'moderately_modern';
  }
  
  // Ensure score is within valid range
  analysis.score = Math.max(
    0,
    Math.min(100, analysis.score || modernityScores[analysis.level as ModernityLevel])
  );

  return {
    level: analysis.level as ModernityLevel,
    score: analysis.score,
    reasoning: analysis.reasoning || 'Analyzed by AI',
  };
}

/**
 * Main function to analyze modernity - tries multiple free APIs
 */
export async function analyzeModernity(
  question: string,
  answer: string
): Promise<ModernityAnalysis> {
  // Try Groq first (faster and more reliable)
  if (process.env.GROQ_API_KEY) {
    try {
      return await analyzeWithGroq(question, answer);
    } catch (error) {
      console.log('Groq failed, trying Hugging Face...', error);
    }
  }

  // Try Hugging Face as fallback
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      return await analyzeWithHuggingFace(question, answer);
    } catch (error) {
      console.log('Hugging Face failed, using default...', error);
    }
  }

  // Fallback if no API keys or all APIs fail
  return {
    level: 'moderately_modern',
    score: 50,
    reasoning: 'No free LLM API configured. Using default moderate modernity. Add GROQ_API_KEY or HUGGINGFACE_API_KEY to .env.local',
  };
}

export function getScoreFromLevel(level: ModernityLevel): number {
  return modernityScores[level];
}
