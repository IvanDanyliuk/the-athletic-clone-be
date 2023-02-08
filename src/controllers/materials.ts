import { RequestHandler } from 'express';
import MaterialModel from '../models/material';


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
    const material = await MaterialModel.findById(id).exec();
    res.status(200).json(material);
  } catch (error) {
    next(error);
  }
};

export const createMaterial: RequestHandler = async (req, res, next) => {
  const { author, title, text, image, views, likes, comments, labels } = req.body;
  try {
    const newMaterial = await MaterialModel.create({
      author,
      title,
      text,
      image,
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