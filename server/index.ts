import express, { type Request, Response, NextFunction } from "express";
import { Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize routes
let server!: Server;

const initialize = async () => {
  server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server Error:', err);
    res.status(status).json({ message });
  });

  // Only in development: setup vite after all other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return app;
};

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  (async () => {
    await initialize();
    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "localhost",
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
} else {
  // For Vercel deployment - initialize but don't start server (Vercel handles that)
  initialize();
}

// Export for Vercel serverless function
export default app;
