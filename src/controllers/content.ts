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
    const contentSections = await ContentSectionModel.find().sort({ createdAt: -1 }).populate('materials').exec();
    res.status(200).json(contentSections);
  } catch (error) {
    next(error);
  }
};

export const createContentSection: RequestHandler<unknown, unknown, CreateContentSectionBody, unknown> = async (req, res, next) => {
  const contentSection = req.body;
  try {
    if(!contentSection.name) {
      throw createHttpError(400, 'Content Label must have a name');
    }
    if(!contentSection.maxLength) {
      throw createHttpError(400, 'Content Label must have a max length');
    }
    const newContentSection = await ContentSectionModel.create(contentSection);
    const response = await newContentSection.populate('materials');
    res.status(201).json(response);
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
    await ContentSectionModel.findByIdAndUpdate(sectionContentToUpdate._id, sectionContentToUpdate);
    const contentSections = await ContentSectionModel.find().sort({ createdAt: -1 }).populate('materials').exec();
    res.status(200).json(contentSections);
  } catch (error) {
    next(error);
  }
};

export const deleteContentSection: RequestHandler = async (req, res, next) => {
  const { id } = req.query;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid content section id'));
    }
    await ContentSectionModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};