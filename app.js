const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { chat } = require('./services/chatgpt');

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {

        console.log("Estoy aca en el prop")
        const prompt = "Sos un chatbot diseñado para responsder preguntas"

        const text = ctx.body;

        const conversations = [];

        const contextMessages = conversations.flatMap(conv => [
            { role: 'user', content: conv.question },
            { role: 'assistant', content: conv.answer},
        ]);

        contextMessages.push({ role: 'user', context: text });

        console.log("hago logs de: ", text);

        const response = await chat(prompt, contextMessages);

        await ctxFn.flowDynamic(response);
    })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
