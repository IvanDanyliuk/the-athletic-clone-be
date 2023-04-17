import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ContentLabelModel from '../models/contentLabel';


interface CreateContentBody {
  name: string,
  maxLength: number
}

export const createContentLabel: RequestHandler<unknown, unknown, CreateContentBody, unknown> = async (req, res, next) => {
  const contentLabel = req.body;

  try {
    if(!contentLabel.name) {
      throw createHttpError(400, 'Content Label must have a name');
    }
    if(!contentLabel.maxLength) {
      throw createHttpError(400, 'Content Label must have a max length');
    }
    const newContentLabel = await ContentLabelModel.create(contentLabel);
    res.status(201).json(newContentLabel);
  } catch (error) {
    next(error);
  }
};