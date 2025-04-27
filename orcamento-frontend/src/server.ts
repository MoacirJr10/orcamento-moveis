import {
  AngularNodeAppEngine,
createNodeRequestHandler,
isMainModule,
writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger, format, transports } from 'winston';
import { config } from './config/server.config';

// Initialize Winston logger
const logger = createLogger({
level: config.logLevel,
format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()]
});

// Path configuration
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const angularApp = new AngularNodeAppEngine();
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      connectSrc: ["'self'", config.apiBaseUrl]
    }
  },
  crossOriginEmbedderPolicy: false // Required for Angular DevTools
}));

// Enable CORS for API routes
app.use(cors({
  origin: config.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

// Apply compression
app.use(compression({ level: 6 }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

/**
 * API Routes
 */
if (config.enableApi) {
  app.use('/api', apiLimiter, (req, res, next) => {
    // API routes would be mounted here
    // Example: app.use('/api', apiRouter);
    res.status(404).json({ message: 'API endpoint not found' });
  });
}

/**
 * Static Assets Configuration
 */
app.use(express.static(browserDistFolder, {
  maxAge: config.isProduction ? '1y' : '0',
  index: false,
  lastModified: true,
  etag: true,
  redirect: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Add security headers for specific file types
    if (path.endsWith('.js')) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }
}));

/**
 * Angular SSR Handler with Error Tracking
 */
app.use('/**', async (req, res, next) => {
  try {
    const startTime = Date.now();
    const response = await angularApp.handle(req);

    if (response) {
      // Add performance headers
      response.headers.set('Server-Timing', `render;dur=${Date.now() - startTime}`);

      // Security headers for SSR responses
      if (config.isProduction) {
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        response.headers.set('X-Content-Type-Options', 'nosniff');
      }

      await writeResponseToNodeResponse(response, res);
      logger.info(`SSR rendered in ${Date.now() - startTime}ms`);
    } else {
      next();
    }
  } catch (error) {
    logger.error('SSR rendering failed:', error);
    if (config.isProduction) {
      res.status(500).sendFile(resolve(browserDistFolder, 'error.html'));
    } else {
      next(error);
    }
  }
});

/**
 * Error Handling Middleware
 */
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Request processing error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: config.isProduction ? 'Internal Server Error' : error.message,
    ...(config.isDevelopment && { stack: error.stack })
  });
});

/**
 * Server Startup
 */
if (isMainModule(import.meta.url)) {
  const port = normalizePort(process.env.PORT || '4000');
  const host = process.env.HOST || '0.0.0.0';

  app.listen(port, host, () => {
    logger.info(`Server started in ${config.environment} mode`);
    logger.info(`Listening on http://${host}:${port}`);
    logger.info(`Static files served from ${browserDistFolder}`);
  });
}

/**
 * Normalize port value
 */
function normalizePort(val: string): number {
  const port = parseInt(val, 10);
  if (isNaN(port)) return 4000;
  if (port >= 0) return port;
  return 4000;
}

/**
 * Export the request handler for external use
 */
export const reqHandler = createNodeRequestHandler(app);
