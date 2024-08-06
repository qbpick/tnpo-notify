// Import the framework and instantiate it
import "dotenv/config";
import Fastify from "fastify";
import { Telegraf } from "telegraf";

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

fastify.get("/webhook", async function handler(request, reply) {
  bot.telegram.sendMessage(
    process.env.ID_TELEGRAM_CHAT,
    `${JSON.stringify(request.query)}`
  );
  return { hello: "world" };
});

// Run the server!
try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

bot.launch();
