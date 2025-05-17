import express, { Request, Response, NextFunction } from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';
import { setupLoggingMiddleware } from '../server/middleware';

// Create and configure express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use(setupLoggingMiddleware);

// Initialize routes
(async () => {
  await registerRoutes(app);
  
  // Serve static files for production
  serveStatic(app);
  
  // Error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Server Error:', err);
    res.status(status).json({ message });
  });
})();

// Export for Vercel serverless function
export default app;
