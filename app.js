const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { chat } = require('./services/chatgpt');

/**
 * Función para construir el contexto de mensajes basado en conversaciones previas.
 * @param {Array} conversations - Conversaciones anteriores del usuario.
 * @param {string} text - Texto actual proporcionado por el usuario.
 * @returns {Array} - Mensajes de contexto para el prompt.
 */
const buildContextMessages = (conversations, text) => {
    const contextMessages = conversations.flatMap(conv => [
        { role: 'user', content: conv.question },
        { role: 'assistant', content: conv.answer },
    ]);
    contextMessages.push({ role: 'user', content: text });
    return contextMessages;
};

/**
 * Función para manejar la acción del flujo principal.
 * @param {Object} ctx - Contexto de la conversación actual.
 * @param {Function} ctxFn - Función para manejar el flujo dinámico.
 */
const handleMainAction = async (ctx, ctxFn) => {
    const prompt = "Sos un chatbot diseñado para responder preguntas";
    const text = ctx.body;
    const conversations = []; // Aquí deberías cargar o gestionar las conversaciones previas.
    
    const contextMessages = buildContextMessages(conversations, text);
    const response = await chat(prompt, contextMessages);
    
    await ctxFn.flowDynamic(response);
};

// Definición del flujo principal
const flowPrincipal = addKeyword(EVENTS.WELCOME).addAction(handleMainAction);

/**
 * Función principal que configura el bot.
 */
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

// Iniciar el bot
main();