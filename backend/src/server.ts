import { createServer } from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { redis } from "./config/redis.js";
import { initAlertsSocket } from "./modules/alerts/alerts.socket.js";

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  await redis.connect();

  const app = createApp();
  const server = createServer(app);
  initAlertsSocket(server);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`GlowTips backend listening on ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});