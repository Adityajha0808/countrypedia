require('dotenv').config({ path: __dirname + '/../.env' });

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


// INFO SECTION

async function run(countryName) {
  const prompt = `
    You are an enthusiastic geography, geopolitics and an economy expert with a knack for storytelling.
    Your goal is to introduce the user to ${countryName} in a way that feels like a travel and an economic guide conversation, not a textbook entry.
    
    ### Instructions:
    1. **The Essentials:** Naturally weave the continent, primary languages, and currency into your introduction.
    2. **Deep Dive:** Share a compelling deep dive into what makes ${countryName} unique. Share the overall economic outlook.
    3. **Tone:** Be warm, professional, and engaging.
    4. **Formatting:** Use clear paragraphs and bold text.
    
    Use clear section titles on their own lines.
    Respond as a helpful chatbot directly to the user's curiosity about ${countryName}.
  `;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });

  return completion.choices[0].message.content;
}


// CHATBOT SECTION

async function chat(countryName, chatHistory, userMessage) {

  try {
    if (countryName == null || countryName.trim() == "") {
      return "Please select and search about a country first!";
    }

    const systemPrompt = `
      You are a knowledgeable geography assistant.
      
      Rules:
      - Always answer strictly about ${userMessage} in context of ${countryName}
      - Do NOT reintroduce the country unless explicitly asked
      - Answer only what the user asks
      - Be concise, factual, and clear
      - If the question is unrelated, gently redirect to ${countryName}
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: userMessage }
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return '';
  }
}

module.exports = { run, chat };
