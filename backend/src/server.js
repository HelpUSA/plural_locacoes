import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Plural Locações Backend API', timestamp: new Date() });
});

// Rotas da API
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Plural Locações rodando na porta ${PORT}`);
});
