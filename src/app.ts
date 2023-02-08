import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import MaterialModel from './models/material';


const app = express();

app.get('/', async (req, res, next) => {
  try {
    const materials = await MaterialModel.find().exec();
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(Error('Endpoint not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = 'An unknown error occurred';
  if(error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
})

export default app;