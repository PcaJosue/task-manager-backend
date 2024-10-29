import 'dotenv/config';
import express from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import routes from './routes';

const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:4200', 'https://task-manager-e05c7.web.app'];
const corsOptions: CorsOptionsDelegate<any> = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptions));
app.use('/api', routes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;
