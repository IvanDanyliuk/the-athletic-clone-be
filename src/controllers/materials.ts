import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import CompetitionModel from '../models/competition';
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
  likes: number,
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
    const data = await MaterialModel.find().sort({ createdAt: -1 }).lean().exec();

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

    const materials = response?.slice(+itemsPerPage * +page, +itemsPerPage * (+page + 1))
      .map(material => ({ ...material, likes: material.likes.length }));
    
    const materialsCount = response ? response.length : data.length;

    res.status(200).json({ materials, materialsCount });
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
    const material = await MaterialModel.findById(id).lean().exec();
    
    if(!material) {
      createHttpError(404, 'Material not found');
    }

    const response = { 
      ...material, 
      likes: material?.likes.length 
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRecentMaterials: RequestHandler<unknown, unknown, unknown, GetRecentMaterialsQuery> = async (req, res, next) => {
  const { materialsNumber, materialTypes } = req.query;
  try {
    const materials = await MaterialModel
      .find({ type: { $in: materialTypes } })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    if(!materials) {
      throw(createHttpError(400, 'Materials not found'));
    }
    const recentMaterials = materials
      .slice(0, materialsNumber)
      .map(material => ({ ...material, likes: material.likes.length }));

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
    const topMaterialsResponse = await MaterialModel
      .find({ type: { $in: ['article', 'note'] } })
      .lean()
      .sort({ likes: -1 })
      .exec();

    const latestPostsResponse = await MaterialModel
      .find({ type: { $in: ['post'] } })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const mustReadArticleResponse = await MaterialModel
      .findOne({ isMain: true })
      .lean()
      .exec();

    const availableLeagues = await CompetitionModel.find().exec();
    const leagues = availableLeagues.map(league => league.fullName);
    const totalLeagueMaterials = await MaterialModel
      .find({ 
        $and: [
          { type: { $in: ['article', 'note'] } },
          { labels: { $in: leagues } }
        ]
       })
       .lean();
    const leagueMaterials = leagues
      .map(leagueName => ({
        league: leagueName,
        logo: availableLeagues.find(item => item.fullName === leagueName)?.logoUrl,
        materials: totalLeagueMaterials
          .filter(material => material.labels.includes(leagueName))
          .map(material => ({ ...material, likes: material.likes.length }))
      }))
      .filter(league => league.materials.length > 0)
      .sort((a, b) => b.materials.length - a.materials.length);

    const topMaterials = topMaterialsResponse
      .slice(0, topMaterialsNum)
      .map(material => ({ ...material, likes: material.likes.length }));

    const latestPosts = latestPostsResponse
      .slice(0, postsNum)
      .map(material => ({ ...material, likes: material.likes.length }));

    const mustRead = {
      ...mustReadArticleResponse,
      likes: mustReadArticleResponse?.likes.length
    };

    res.status(200).json({
      topMaterials,
      latestPosts,
      mustRead,
      leagueMaterials
    });
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



// const likeMaterial: RequestHandler = async (req, res, next) => {
//   try {
    
//   } catch (error) {
//     next(error);
//   }
// };

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
  likes: number,
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
    const data = await MaterialModel.find().sort({ createdAt: -1 }).exec();

    res.status(200).json({
      materials: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      materialsCount: data.length
    });
  } catch (error) {
    next(error);
  }
};