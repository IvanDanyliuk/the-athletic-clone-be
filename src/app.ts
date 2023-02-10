import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';
import materialRoutes from './routes/materials';
import clubRoutes from './routes/clubs';
import competitionRoutes from './routes/competitions';
import playerRoutes from './routes/players';


const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/materials', materialRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/players', playerRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  if(isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  } 
  res.status(statusCode).json({ error: errorMessage });
});

export default app;