import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import { UserType } from '../models/user';


export const getMaterials: RequestHandler = async (req, res, next) => {
  try {
    const materials = await MaterialModel.find().exec();
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};

export const getMaterial: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }
    const material = await MaterialModel.findById(id).exec();
    if(!material) {
      createHttpError(404, 'Material not found');
    }
    res.status(200).json(material);
  } catch (error) {
    next(error);
  }
}

interface CreateMaterialBody {
  author: UserType,
  title?: string,
  text: string,
  imageUrl?: string,
  views: number,
  likes: number,
  comments: {
    author: UserType,
    text: string
  }[],
  labels: string[]
}

export const createMaterial: RequestHandler<unknown, unknown, CreateMaterialBody, unknown> = async (req, res, next) => {
  const { author, title, text, imageUrl, views, likes, comments, labels } = req.body;
  try {
    if(!text) {
      throw createHttpError(400, 'Material must have a text');
    }

    const newMaterial = await MaterialModel.create({
      author,
      title,
      text,
      imageUrl,
      views,
      likes,
      comments,
      labels
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    next(error);
  }
};