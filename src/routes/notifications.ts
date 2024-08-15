import { FastifyReply, FastifyRequest } from "fastify";
import { bot } from "../app.js";
import { IPipelineNotify } from "../interfaces/pipline-notify.js";
import { pipelineTemplate } from "../templates/pipeline.template.js";

export async function notifications(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sendNotification = async (data: IPipelineNotify) => {
    await bot.telegram.sendMessage(
      "-100" + data.chatId,
      pipelineTemplate(data),
      {
        parse_mode: "HTML",
        message_thread_id: Number(data.topicId),
      }
    );
  };

  await sendNotification(request.body as IPipelineNotify);
  return reply.send({ ok: true });
}
