import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import CompetitionModel from '../models/competition';
import ClubModel from '../models/club';
import UserModel from '../models/user';
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
  preview?: string,
  image?: string,
  isMain?: boolean,
  status: string,
  views: number,
  likes: string[],
  publicationDate: string | any,
  comments: {
    user: string,
    message: string
  }[],
  labels: string[]
}

interface GetAllMaterialsQuery {
  page: string,
  itemsPerPage: string,
  filterData?: IMaterialsFilterData,
  sortData?: IMaterialsSortData
}

interface GetRecentMaterialsQuery {
  materialsNumber: number,
  materialTypes: string[]
}


export const getMaterials: RequestHandler<unknown, unknown, unknown, GetAllMaterialsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;
  try {
    const data = await MaterialModel.find().sort({ createdAt: -1 }).exec();

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

export const getRecentMaterials: RequestHandler<unknown, unknown, unknown, GetRecentMaterialsQuery> = async (req, res, next) => {
  const { materialsNumber, materialTypes } = req.query;
  try {
    const materials = await MaterialModel.find({ type: { $in: materialTypes } }).sort({ createdAt: -1 }).exec();
    if(!materials) {
      throw(createHttpError(400, 'Materials not found'));
    }
    const recentMaterials = materials.slice(0, materialsNumber);
    res.status(200).json(recentMaterials);
  } catch (error) {
    next(error)
  }
};

interface GetSecondaryMaterialsQuery {
  topMaterialsNum: number,
  postsNum: number,
}

export const getHomepageSecondaryMaterials: RequestHandler<unknown, unknown, unknown, GetSecondaryMaterialsQuery> = async (req, res, next) => {
  const { topMaterialsNum, postsNum } = req.query;
  try {
    const topMaterials = await MaterialModel
      .find({ type: { $in: ['article', 'note'] } })
      .sort({ likes: -1 })
      .exec();

    const latestPosts = await MaterialModel
      .find({ type: { $in: ['post'] } })
      .sort({ createdAt: -1 })
      .exec();

    const mustReadArticle = await MaterialModel.findOne({ isMain: true });

    const availableLeagues = await CompetitionModel.find().exec();
    const leagues = availableLeagues.map(league => league.fullName);
    const totalLeagueMaterials = await MaterialModel
      .find({ 
        $and: [
          { type: { $in: ['article', 'note'] } },
          { labels: { $in: leagues } }
        ]
       });
    const leagueMaterials = leagues
      .map(leagueName => ({
        league: leagueName,
        logo: availableLeagues.find(item => item.fullName === leagueName)?.logoUrl,
        materials: totalLeagueMaterials.filter(material => material.labels.includes(leagueName))
      }))
      .filter(league => league.materials.length > 0)
      .sort((a, b) => b.materials.length - a.materials.length);

    res.status(200).json({
      topMaterials: topMaterials.slice(0, topMaterialsNum),
      latestPosts: latestPosts.slice(0, postsNum),
      mustRead: mustReadArticle,
      leagueMaterials
    });
  } catch (error) {
    next(error);
  }
};

interface GetFilterValues {
  value: string;
}

export const getSearchValues: RequestHandler<unknown, unknown, unknown, GetFilterValues> = async (req, res, next) => {
  const { value } = req.query;
  try {
    const regex = new RegExp(value);
    const competitions = await CompetitionModel.find({ fullName: { $regex: regex, $options: 'i' } }).exec();
    const clubs = await ClubModel.find({ $or: [{ fullName: { $regex: regex, $options: 'i' } }, { commonName: { $regex: regex, $options: 'i' } }] }).exec();
    const authors = await UserModel.find({ $and: [{ role: 'author' }, { lastName: { $regex: regex, $options: 'i' } }] }).exec();

    const response = { competitions, clubs, authors };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

interface SearchMaterials {
  value: string | string[];
  type: string | string[];
  materialsNum?: number;
}

export const searchMaterials: RequestHandler<unknown, unknown, unknown, SearchMaterials> = async (req, res, next) => {
  const { value, type, materialsNum } = req.query;
  const requestValue = typeof value === 'string' ? new RegExp(value) : value[0];
  try {
    const materials = await MaterialModel.find({ 
      $and: [
        { 
          $or: [
            { labels: value }, 
            { title: { $regex: requestValue, $options: 'i' } }
          ] 
        }, 
        { type }
      ] })
      .sort({ createdAt: -1 })
      .exec();
    
    const response = materialsNum ? materials.slice(0, materialsNum) : materials;
    res.status(200).json(response);
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
    
    if(material.isMain) {
      const mainMaterial = await MaterialModel.find({ isMain: true }).exec();
      if(mainMaterial) {
        await MaterialModel.findByIdAndUpdate(mainMaterial, { ...mainMaterial, isMain: false });
      }
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
  preview?: string,
  image?: string,
  isMain?: boolean,
  status: string,
  views: number,
  likes: string[],
  publicationDate: string | any,
  comments: {
    user: string,
    message: string
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

    if(materialToUpdate.isMain) {
      const mainMaterial = await MaterialModel.find({ isMain: true }).exec();
      if(mainMaterial) {
        await MaterialModel.findByIdAndUpdate(mainMaterial, { ...mainMaterial, isMain: false });
      }
    }

    await MaterialModel.findByIdAndUpdate(materialToUpdate._id, materialToUpdate);

    const updatedMaterial = await MaterialModel.findById(materialToUpdate._id).lean().exec();

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
    const data = await MaterialModel.find().sort({ createdAt: -1 }).exec();

    res.status(200).json({
      materials: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      materialsCount: data.length
    });
  } catch (error) {
    next(error);
  }
};