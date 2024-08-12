// Import the framework and instantiate it
import "dotenv/config";
import Fastify, { FastifyRequest, RouteGenericInterface } from "fastify";
import { Telegraf } from "telegraf";
import { bold, code, FmtString, pre } from "telegraf/format";

const fastify = Fastify({
  logger: true,
});
const bot = new Telegraf(process.env.API_TELEGRAM_BOT_KEY || "");

const devMessage = (request: FastifyRequest) =>
  code(
    "headers: \n" +
      JSON.stringify(request.headers, null, 2) +
      "\n\nbody: \n" +
      JSON.stringify(request.body, null, 2) +
      "\n\nquery: \n" +
      JSON.stringify(request.query, null, 2)
  );

interface IPipelineNotify {
  type: string;
  result: string;
  branch: string;
  project: string;
  title: string;
}

const pipelineTemplate = (data: IPipelineNotify) => `
🟢 🟢 🟢
🟢 🟢 🔴
❌ ❌ ❌
❌ ✅ ✅
✅ ✅ ❌
<b><i>${data.result}</i></b>
<b>Pipline</b> ${data.type}
<b>Ветка</b> ${data.branch}
<b>Коммит</b> ${data.title}

<pre><code class="json">${JSON.stringify(data, null, 2)}</code></pre>
`;

// devMessage(request)
// ❌✅
// 🔴🟢
fastify.post("/webhook", async function handler(request, reply) {
  bot.telegram.sendMessage(
    process.env.ID_TELEGRAM_CHAT || "",
    pipelineTemplate(request.body as IPipelineNotify),
    { parse_mode: "HTML" }
  );
  return reply.send({ ok: true });
});
// Run the server!
try {
  await fastify.listen({ port: 80, host: "0.0.0.0" });
  await bot.launch();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
