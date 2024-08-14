import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text input is required' }), { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant that generates flashcards in JSON format.' },
        { role: 'user', content: `Generate 12 flashcards for the following text:\n\n${text}\n\nPlease provide the flashcards in a JSON format with "front" and "back" keys.` },
      ],
    });

    let responseText = completion.choices[0].message.content.trim();

    // Attempt to clean up the response and extract valid JSON
    const jsonStartIndex = responseText.indexOf('['); // Finds the start of the JSON array
    const jsonEndIndex = responseText.lastIndexOf(']') + 1; // Finds the end of the JSON array
    const jsonString = responseText.slice(jsonStartIndex, jsonEndIndex);

    let flashcards;
    try {
      flashcards = JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON:', error.message);
      return new Response(JSON.stringify({ error: 'Failed to generate valid JSON' }), { status: 500 });
    }

    return new Response(JSON.stringify(flashcards), { status: 200 });
  } catch (error) {
    console.error('Error during OpenAI API call:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
