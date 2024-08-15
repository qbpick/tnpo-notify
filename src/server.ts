import { build, bot } from "./app.js";

const app = build();

try {
  await app.listen({ port: 80, host: "0.0.0.0" });
  await bot.launch();
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
