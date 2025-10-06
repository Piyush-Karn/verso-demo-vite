import axios from 'axios';

const CLAUDE_API_KEY = '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';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export interface TripContext {
  country: string;
  startDate: string;
  endDate: string;
  travelers: string;
  preferences?: {
    stay: string[];
    cuisine: string[];
    withKids: boolean;
    flights: string[];
  };
  savedInspirations?: Array<{
    title: string;
    type: string;
    location: string;
  }>;
}

export interface AIResponse {
  success: boolean;
  message: string;
  suggestions?: Array<{
    type: 'activity' | 'restaurant' | 'hotel' | 'modification';
    title: string;
    description: string;
    location?: string;
    reasoning?: string;
  }>;
}

export class VersoAI {
  private static async callClaude(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        CLAUDE_API_URL,
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  static async askVerso(question: string, tripContext: TripContext): Promise<AIResponse> {
    try {
      const contextPrompt = `
You are Verso, an AI travel assistant helping users plan their trip to ${tripContext.country}.

TRIP CONTEXT:
- Destination: ${tripContext.country}
- Dates: ${tripContext.startDate} to ${tripContext.endDate}
- Travelers: ${tripContext.travelers}
- Preferences: ${JSON.stringify(tripContext.preferences || {})}
${tripContext.savedInspirations ? `- Saved Inspirations: ${tripContext.savedInspirations.map(i => i.title).join(', ')}` : ''}

USER QUESTION: "${question}"

Provide a helpful, personalized response that:
1. Addresses their specific question
2. Takes into account their trip context and preferences
3. Offers 2-3 specific, actionable suggestions
4. Maintains a friendly, knowledgeable tone

Format your response as JSON:
{
  "message": "Your main response text",
  "suggestions": [
    {
      "type": "activity|restaurant|hotel|modification",
      "title": "Suggestion title",
      "description": "Brief description",
      "location": "Specific location if applicable",
      "reasoning": "Why this fits their preferences"
    }
  ]
}
      `;

      const aiResponse = await this.callClaude(contextPrompt);
      
      try {
        const parsed = JSON.parse(aiResponse);
        return {
          success: true,
          message: parsed.message,
          suggestions: parsed.suggestions || []
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          success: true,
          message: aiResponse,
          suggestions: []
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "I'm having trouble connecting right now. Please try again in a moment.",
        suggestions: []
      };
    }
  }

  static async generateItinerarySuggestions(tripContext: TripContext): Promise<AIResponse> {
    try {
      const prompt = `
You are Verso, an AI travel assistant. Generate intelligent itinerary suggestions for a ${tripContext.country} trip.

TRIP DETAILS:
- Destination: ${tripContext.country}
- Duration: ${tripContext.startDate} to ${tripContext.endDate}
- Travelers: ${tripContext.travelers}
- Preferences: ${JSON.stringify(tripContext.preferences || {})}

Based on this information, suggest 3-4 personalized improvements or additions to their itinerary. Consider:
- Local experiences that match their travel style
- Hidden gems vs popular attractions based on their preferences
- Timing and logistics optimization
- Weather and seasonal considerations

Respond in JSON format:
{
  "message": "Brief intro about the suggestions",
  "suggestions": [
    {
      "type": "activity|restaurant|modification",
      "title": "Suggestion title",
      "description": "What makes this special",
      "location": "Specific area/city",
      "reasoning": "Why this fits their trip"
    }
  ]
}
      `;

      const aiResponse = await this.callClaude(prompt);
      
      try {
        const parsed = JSON.parse(aiResponse);
        return {
          success: true,
          message: parsed.message,
          suggestions: parsed.suggestions || []
        };
      } catch (parseError) {
        return {
          success: true,
          message: aiResponse,
          suggestions: []
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "I'm having trouble generating suggestions right now. Please try again.",
        suggestions: []
      };
    }
  }

  static async optimizeDay(dayPlan: any[], tripContext: TripContext): Promise<AIResponse> {
    try {
      const prompt = `
You are Verso, helping optimize a day in ${tripContext.country} for ${tripContext.travelers} travelers.

CURRENT DAY PLAN:
${dayPlan.map(activity => `- ${activity.title} (${activity.type}, ${activity.duration})`).join('\n')}

CONTEXT:
- Location: ${tripContext.country}
- Travel style: ${tripContext.travelers}
- Preferences: ${JSON.stringify(tripContext.preferences || {})}

Suggest optimizations for:
1. Better timing/flow
2. Transportation efficiency
3. Additional experiences that complement existing plans
4. Local dining recommendations between activities

Respond in JSON format with actionable suggestions.
      `;

      const aiResponse = await this.callClaude(prompt);
      
      try {
        const parsed = JSON.parse(aiResponse);
        return {
          success: true,
          message: parsed.message || 'Here are some optimizations for your day:',
          suggestions: parsed.suggestions || []
        };
      } catch (parseError) {
        return {
          success: true,
          message: aiResponse,
          suggestions: []
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "I'm having trouble optimizing right now. Please try again.",
        suggestions: []
      };
    }
  }
}

export default VersoAI;