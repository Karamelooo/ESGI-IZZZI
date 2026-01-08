import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn('OPENROUTER_API_KEY not set. AI synthesis will not work.');
    }
  }

  async generateFeedbackSynthesis(feedbackData: string[]): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    if (feedbackData.length === 0) {
      return 'Aucun retour étudiant disponible pour générer une synthèse.';
    }

    const prompt = `Tu es un assistant pédagogique. Analyse les retours étudiants suivants et génère une synthèse COURTE en français, sous forme de conclusion.

Retours étudiants:
${feedbackData.map((feedback, index) => `${index + 1}. ${feedback}`).join('\n')}

IMPORTANT: Ta réponse ne doit PAS dépasser 800 caractères. Génère un texte fluide et concis qui résume les tendances principales (points positifs et axes d'amélioration) en 2-3 paragraphes maximum. Pas de listes à puces, pas de titres. Réponds uniquement avec la synthèse.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'IZZZI Feedback Synthesis',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API error:', errorData);
        throw new Error('Échec de la requête vers OpenRouter');
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'Échec de la génération de synthèse.'
      );
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Échec de la génération de synthèse via OpenRouter');
    }
  }
}
