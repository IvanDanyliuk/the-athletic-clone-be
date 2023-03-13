import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import { UserType } from '../models/user';


interface CreateMaterialBody {
  author: { 
    name: string,
    photoUrl?: string,
    organization: string,
    position: string,
  },
  type: string,
  title?: string,
  content: string,
  image?: string,
  views: number,
  likes: number,
  comments: {
    author: UserType,
    text: string
  }[],
  labels: string[]
}

interface GetAllMaterialsQuery {
  page: string,
  itemsPerPage: string,
  filterData?: string,
  sortData?: {
    indicator: string,
    order: Order
  }
}

enum Order {
  asc = 'asc',
  desc = 'desc'
}

export const getAllMaterials: RequestHandler<unknown, unknown, unknown, GetAllMaterialsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;
  try {
    const data = await MaterialModel.find().exec();

    let response;

    if(sortData) {
      response = data.sort((a: any, b: any) => {
        if(sortData.order === Order.asc) {
          if(sortData.indicator === 'author') {
            return a.author.name > b.author.name ? 1 : -1
          } else {
            return a[sortData.indicator] > b[sortData.indicator] ? 1 : -1
          }
        } else {
          if(sortData.indicator === 'author') {
            return b.author.name > a.author.name ? 1 : -1
          } else {
            return b[sortData.indicator] > a[sortData.indicator] ? 1 : -1
          }
        }
      });
    }

    if(filterData) {
      response = data;
    }

    if(!filterData && !sortData) {
      response = data;
    }

    res.status(200).json({
      materials: response?.slice(+itemsPerPage * +page, +itemsPerPage * (+page + 1)),
      materialsCount: data.length
    });
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
};

export const createMaterial: RequestHandler<unknown, unknown, CreateMaterialBody, unknown> = async (req, res, next) => {
  const material = req.body;
  try {
    if(!material.content) {
      throw createHttpError(400, 'Material must have a text');
    }
    const newMaterial = await MaterialModel.create(material);
    res.status(201).json(newMaterial);
  } catch (error) {
    next(error);
  }
};

interface UpdateMaterialParams {
  id: string,
}

interface UpdateMaterialBody {
  author: { 
    name: string,
    photoUrl?: string,
    organization: string,
    position: string,
  },
  type: string,
  title?: string,
  content: string,
  image?: string,
  views: number,
  likes: number,
  comments: {
    author: UserType,
    text: string
  }[],
  labels: string[]
}

export const updateMaterial: RequestHandler<UpdateMaterialParams, unknown, UpdateMaterialBody, unknown> = async (req, res, next) => {
  const { id } = req.params;
  const materialToUpdate = req.body;
  
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    if(!materialToUpdate.content) {
      throw createHttpError(400, 'Material must have a text');
    }

    const updatedMaterial = await MaterialModel.findByIdAndUpdate(id, materialToUpdate);
    res.status(200).json(updatedMaterial);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    await MaterialModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};