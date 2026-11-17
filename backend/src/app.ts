import express from 'express';
import concessionariasRouter from './routes/concessionarias.ts';
import veiculosRouter from './routes/veiculos.ts';
import { logger } from './middleware/logger.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'Concessionária API', versao: '1.0.0', rotas: ['/concessionarias', '/veiculos'] });
});

// --- Rotas ---
app.use('/concessionarias', concessionariasRouter);
app.use('/veiculos', veiculosRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;
