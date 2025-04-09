import { Handler } from '@netlify/functions';
import dotenv from 'dotenv';

dotenv.config();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userTodos = body.todos || [];
    
    // Create a well-formatted list of todos
    const todoList = userTodos.map((todo: string, index: number) => 
      `${index + 1}. ${todo}`
    ).join('\n');
    
    // Create the prompt with system instructions and todos
    const systemPrompt = `You are a helpful daily planner assistant. The output should then be a fun and simple visualization of what they should do, when, and ideally detail out why they should do things in this order. Please return flat, raw JSON in this specific format outlined in ONE LINE. This is for DIRECT DATABASE ENTRY. The daySummary should be 1 sentence max.

    For instance:

    [ { "relevantEmoji": "🐦☕️🌸✉️👧🏫", "daySummary": "Your day is set to energize and uplift you from the moment you greet the bird with a smile and savor your morning coffee, paving the way for a calm and creative break with lavender before writing to Ma. In the afternoon, as you pick up your daughter from school, you'll feel recharged and balanced, ready to embrace life with both joy and purpose." }, [ { "startTime": "🕗 8a", "todoName": "Say Good Morning to bird", "explanationOfOrder": "Saying good morning to the bird is a task that should probably be done early in the day." }, { "startTime": "🕣 8:30a", "todoName": "Drink Coffee", "explanationOfOrder": "Drinking coffee is a common morning activity, so we've put it right after greeting the bird." }, { "startTime": "🕘 9a", "todoName": "Smoke Lavender", "explanationOfOrder": "Smoking lavender can help you relax, setting the stage for later activities." }, { "startTime": "🕙 10a", "todoName": "Write to Ma", "explanationOfOrder": "Since writing to your ma can be done anytime and doesn't require a specific time, it can be fit into a slot where you're comfortable and relaxed, perhaps after smoking lavender." }, { "startTime": "🕒 3p", "todoName": "Pick up daughter from school", "explanationOfOrder": "Picking up your daughter from school is likely to be in the afternoon, depending on her school timings." } ] ]
    `;
    
    const userPrompt = `Here are my tasks for today:\n${todoList}\n\nPlease help me organize these into a practical daily schedule.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      throw new Error(`OpenAI Error: ${openaiRes.status} - ${errorText}`);
    }

    const data = await openaiRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error(err.message || err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error',
        message: err.message || 'Unknown error',
      }),
    };
  }
};

export { handler };