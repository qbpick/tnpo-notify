// Import the framework and instantiate it
import "dotenv/config";
import Fastify, { FastifyRequest } from "fastify";
import { Telegraf } from "telegraf";
import { notifications } from "./routes/notifications.js";

const bot = new Telegraf(process.env.API_TELEGRAM_BOT_KEY || "");

bot.command("start", (ctx) => {
  console.log(ctx.update.message.chat);
  console.log(ctx.update.message);
  ctx.reply("Hello!");
});

const build = () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ ok: false, error: error });
  });

  fastify.post("/notification", notifications);

  return fastify;
};

export { build, bot };
