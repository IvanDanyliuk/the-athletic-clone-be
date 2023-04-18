import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ContentSectionModel from '../models/content';
import { MaterialType } from '../models/material';


interface CreateContentSectionBody {
  name: string,
  maxLength: number,
  materials: MaterialType[]
}

interface UpdateContentSectionBody {
  _id: string,
  name: string,
  maxLength: number,
  materials: MaterialType[]
}

export const getContentSections: RequestHandler = async (req, res, next) => {
  try {
    const contentSections = await ContentSectionModel.find().exec();
    res.status(200).json(contentSections);
  } catch (error) {
    next(error);
  }
};

export const createContentSection: RequestHandler<unknown, unknown, CreateContentSectionBody, unknown> = async (req, res, next) => {
  const contentLabel = req.body;
  try {
    if(!contentLabel.name) {
      throw createHttpError(400, 'Content Label must have a name');
    }
    if(!contentLabel.maxLength) {
      throw createHttpError(400, 'Content Label must have a max length');
    }
    const newContentLabel = await ContentSectionModel.create(contentLabel);
    res.status(201).json(newContentLabel);
  } catch (error) {
    next(error);
  }
};

export const updateContentSection: RequestHandler<unknown, unknown, UpdateContentSectionBody, unknown> = async (req, res, next) => {
  const sectionContentToUpdate = req.body;
  try {
    if(!mongoose.isValidObjectId(sectionContentToUpdate._id)) {
      throw(createHttpError(400, 'Invalid section id'));
    }
    if(!sectionContentToUpdate.name) {
      throw createHttpError(400, 'Section must have a name');
    }
    const updatedSectionContent = await ContentSectionModel.findByIdAndUpdate(sectionContentToUpdate._id, sectionContentToUpdate);
    res.status(200).json(updatedSectionContent);
  } catch (error) {
    next(error);
  }
};