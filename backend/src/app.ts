import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { apiRateLimit } from "./common/middleware/rate-limit.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { creatorsRouter } from "./modules/creators/creators.routes.js";
import { tipsRouter } from "./modules/tips/tips.routes.js";
import { walletRouter } from "./modules/wallet/wallet.routes.js";
import { withdrawalsRouter } from "./modules/withdrawals/withdrawals.routes.js";
import { alertsRouter } from "./modules/alerts/alerts.routes.js";
import { audioRouter } from "./modules/audio/audio.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { swaggerSpec } from "./docs/swagger.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(apiRateLimit);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/creators", creatorsRouter);
  app.use("/api/v1/tips", tipsRouter);
  app.use("/api/v1/wallet", walletRouter);
  app.use("/api/v1/withdrawals", withdrawalsRouter);
  app.use("/api/v1/alerts", alertsRouter);
  app.use("/api/v1/audio", audioRouter);
  app.use("/api/v1/admin", adminRouter);

  app.use(errorHandler);

  return app;
}