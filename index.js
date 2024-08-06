// Import the framework and instantiate it
import "dotenv/config";
import Fastify from "fastify";
import { Telegraf } from "telegraf";
import { bold, code, FmtString, pre } from "telegraf/format";

const fastify = Fastify({
  logger: true,
});
const bot = new Telegraf(process.env.API_TELEGRAM_BOT_KEY);

// bot.on("message", async (ctx) => {
//   console.log(ctx.message);
// });

// Declare a route
// fastify.get("/", async function handler(request, reply) {
//   bot.telegram.sendMessage(
//     process.env.ID_TELEGRAM_CHAT,
//     request
//   );
//   return { hello: "world" };
// });

fastify.post("/webhook", async function handler(request, reply) {
  bot.telegram.sendMessage(
    process.env.ID_TELEGRAM_CHAT,
    code(
      "headers: \n" +
        JSON.stringify(request.headers, null, 2) +
        "\n\nbody: \n" +
        JSON.stringify(request.body, null, 2) +
        "\n\nquery: \n" +
        JSON.stringify(request.query, null, 2)
    )
  );
  return reply.send({ ok: true });
});
// bot.telegram.sendMessage(
//   process.env.ID_TELEGRAM_CHAT,
//    `headers ${pre(JSON.stringify(request.headers))}\n
//      query ${pre(JSON.stringify(request.query))}\n
//      body ${pre(JSON.stringify(request.body))}`
// );

// Run the server!
try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

bot.launch();
