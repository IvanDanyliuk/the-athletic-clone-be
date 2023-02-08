import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import materialRoutes from './routes/materials';


const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/materials', materialRoutes);

app.use((req, res, next) => {
  next(Error('Endpoint not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = 'An unknown error occurred';
  if(error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
});

export default app;