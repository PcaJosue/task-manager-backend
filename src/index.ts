import 'dotenv/config';
import express from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import routes from './routes';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:4200',
  'https://task-manager-e05c7.web.app',
  'https://task-manager-e05c7.firebaseapp.com'
];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));
app.use('/api', routes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;
