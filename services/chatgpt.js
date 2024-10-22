require("dotenv").config();
const OpenAI = require("openai");

// Retrieve the OpenAI API key from environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;

// Function to interact with the OpenAI API
const chat = async (prompt, messages) => {
  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Log messages for debugging purposes
    console.log("Messages: ", messages);

    // Ensure all messages have a valid content value
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: msg.content || ""
    }));

    // Call the OpenAI API with the prompt and the sanitized messages
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: prompt },
        ...sanitizedMessages,
      ],
    });

    // Extract and return the content from the API response
    const answer = completion.choices[0].message.content;
    return answer;
  } catch (err) {
    // Log the error and return an error message
    console.error("Error connecting to OpenAI:", err);
    return "ERROR";
  }
};

// Export the chat function for external use
module.exports = { chat };