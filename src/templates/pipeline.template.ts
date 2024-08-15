import { FastifyRequest } from "fastify";
import { IPipelineNotify } from "../interfaces/pipline-notify.js";
import { code } from "telegraf/format";

export const pipelineTemplate = (data: IPipelineNotify) => `
${data.result === data.expected_result ? "🟢" : "🔴"}
<b>Ветка:</b> ${data.branch}
<b>Коммит:</b> ${data.title}

${
  data.result !== data.expected_result
    ? `Последний успешный stage: <b><i>${data.result}</i></b>`
    : ""
}
${data.result !== data.expected_result ? data.CI_PIPELINE_URL : ""}
`;

// <pre><code class="json">${JSON.stringify(data, null, 2)}</code></pre>

export const devMessage = (request: FastifyRequest) =>
  code(
    "headers: \n" +
      JSON.stringify(request.headers, null, 2) +
      "\n\nbody: \n" +
      JSON.stringify(request.body, null, 2) +
      "\n\nquery: \n" +
      JSON.stringify(request.query, null, 2)
  );

