import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import { UserType } from '../models/user';
import { IMaterialsFilterData, IMaterialsSortData } from '../types';
import { filterMaterials, sortMaterials } from '../util/helpers';


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
  filterData?: IMaterialsFilterData,
  sortData?: IMaterialsSortData
}



export const getMaterials: RequestHandler<unknown, unknown, unknown, GetAllMaterialsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;
  try {
    const data = await MaterialModel.find().exec();

    let response;

    if(sortData) {
      response = sortMaterials(data, sortData);
    }

    if(filterData) {
      response = filterMaterials(data, filterData);
    }

    if(filterData && sortData) {
      const filteredData = filterMaterials(data, filterData);
      response = sortMaterials(filteredData, sortData);
    }

    if(!filterData && !sortData) {
      response = data;
    }

    res.status(200).json({
      materials: response?.slice(+itemsPerPage * +page, +itemsPerPage * (+page + 1)),
      materialsCount: response ? response.length : data.length 
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

interface UpdateMaterialBody {
  _id: string,
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

export const updateMaterial: RequestHandler<unknown, unknown, UpdateMaterialBody, unknown> = async (req, res, next) => {
  const materialToUpdate = req.body;
  
  try {
    if(!mongoose.isValidObjectId(materialToUpdate._id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    if(!materialToUpdate.content) {
      throw createHttpError(400, 'Material must have a text');
    }

    const updatedMaterial = await MaterialModel.findByIdAndUpdate(materialToUpdate._id, materialToUpdate);
    res.status(200).json(updatedMaterial);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial: RequestHandler = async (req, res, next) => {
  const { id, page, itemsPerPage } = req.query;
  
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    await MaterialModel.findByIdAndDelete(id);
    const data = await MaterialModel.find().exec();

    res.status(200).json({
      materials: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      materialsCount: data.length
    });
  } catch (error) {
    next(error);
  }
};