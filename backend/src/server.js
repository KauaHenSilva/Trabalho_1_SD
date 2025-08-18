import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import api from './routes/index.js';

const app = express();
const PORT = Number(process.env.PORT_BACKEND || 9001);
const HOST = '0.0.0.0';

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});

// API routes
app.use('/', api);

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
