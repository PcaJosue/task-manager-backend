import 'dotenv/config';
import express from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import routes from './routes';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://task-manager-e05c7.web.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/api', routes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;
