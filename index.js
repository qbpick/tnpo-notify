// Import the framework and instantiate it
import "dotenv/config";
import Fastify from "fastify";
import { Telegraf } from "telegraf";
import { code } from "telegraf/format";
const fastify = Fastify({
    logger: true,
});
const bot = new Telegraf(process.env.API_TELEGRAM_BOT_KEY || "");
fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ ok: false, error: error });
});
bot.command("start", (ctx) => {
    console.log(ctx.update.message.chat);
    console.log(ctx.update.message);
    ctx.reply("Hello!");
});
const devMessage = (request) => code("headers: \n" +
    JSON.stringify(request.headers, null, 2) +
    "\n\nbody: \n" +
    JSON.stringify(request.body, null, 2) +
    "\n\nquery: \n" +
    JSON.stringify(request.query, null, 2));
const pipelineTemplate = (data) => `
${data.result === data.expected_result ? "🟢" : "🔴"}
<b>Ветка:</b> ${data.branch}
<b>Коммит:</b> ${data.title}

${data.result !== data.expected_result
    ? `Последний успешный stage: <b><i>${data.result}</i></b>`
    : ""}
${data.result !== data.expected_result ? data.CI_PIPELINE_URL : ""}
`;
// <pre><code class="json">${JSON.stringify(data, null, 2)}</code></pre>
const sendNotification = async (data) => {
    await bot.telegram.sendMessage("-100" + data.chatId, pipelineTemplate(data), {
        parse_mode: "HTML",
        message_thread_id: Number(data.topicId),
    });
};
// devMessage(request)
// ❌✅
// 🔴🟢
fastify.post("/webhook", async function handler(request, reply) {
    await sendNotification(request.body);
    return reply.send({ ok: true });
});
// Run the server!
try {
    await fastify.listen({ port: 80, host: "0.0.0.0" });
    await bot.launch();
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
