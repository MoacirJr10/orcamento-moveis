import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDistFolder = __dirname;
const browserDistFolder = resolve(serverDistFolder, '../browser');
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(helmet()); // Segurança básica
app.use(cors()); // Controle de CORS
app.use(express.json()); // Parse de JSON
app.use(express.urlencoded({ extended: true })); // Parse de URL-encoded

// Middlewares de produção
if (isProduction) {
  app.use(compression()); // Compressão GZIP
  app.use(morgan('combined')); // Logging avançado
} else {
  app.use(morgan('dev')); // Logging simplificado para desenvolvimento
}

// Servir arquivos estáticos
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false,
  etag: true,
  lastModified: true,
}));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// API Routes (exemplo)
app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
});

// Tratamento de erros global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Ocorreu um erro interno no servidor' });
});

// Rota para renderização Angular (deve ser a última)
app.get('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.error('Erro na renderização Angular:', err);
      next(err);
    });
});

// Inicialização do servidor
if (isMainModule(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Modo: ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
    console.log(`Arquivos estáticos servidos de: ${browserDistFolder}`);
  });
}

// Export para ambientes serverless
export const handler = createNodeRequestHandler(app);
