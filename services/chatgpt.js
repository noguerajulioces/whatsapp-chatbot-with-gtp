require("dotenv").config();
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;

const chat = async (prompt, messages) => {
  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    console.log("msg ", messages);
    // Asegurarse de que todos los mensajes tengan un content válido
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: msg.context
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: prompt },
        ...sanitizedMessages
      ],
    });
    const answ = completion.choices[0].message.content;
    return answ;
  } catch (err) {
    console.error("Error al conectar con OpenAI:", err);
    return "ERROR";
  }
};
module.exports = { chat };