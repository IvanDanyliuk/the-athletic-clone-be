import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ClubModel from '../models/club';
import { CreateClubBody, GetAllClubsQuery, UpdateClubBody } from '../types/clubs';


export const getClubs: RequestHandler<unknown, unknown, unknown, GetAllClubsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;

  const order = !sortData || sortData.order === 'desc' ? -1 : 1;
  const sortIndicator = sortData ? sortData.indicator : 'createdAt';

  try {
    
    const data = await ClubModel.aggregate([
      { 
        $match: {
          $expr: {
            $cond: {
              if: filterData,
              then: { $eq: ['$country', filterData?.country] },
              else: true
            }
          }
        } 
      },
      {
        $sort: {
          [sortIndicator]: order,
          createdAt: -1
        }
      },
      { $skip: +page * +itemsPerPage },
      { $limit: +itemsPerPage }
    ])
    .exec();

    const count = filterData ? 
      await ClubModel.countDocuments({ 'country': filterData.country }) : 
      await ClubModel.countDocuments({});

    res.status(200).json({
      clubs: data,
      clubsCount: count
    });  
  } catch (error) {
    next(error)
  }
};

export const getClubsByCountry: RequestHandler = async (req, res, next) => {
  const { country } = req.query;
  try {
    const clubs = country !== 'International' ? 
      await ClubModel.find({ country }).sort({ createdAt: -1 }).exec() : 
      await ClubModel.find().sort({ createdAt: -1 }).exec();
    if(!clubs) {
      throw(createHttpError(404, 'Clubs not found'));
    }
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
};

export const getClub: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid club id'));
    }
    const club = await ClubModel.findById(id);
    if(!club) {
      createHttpError(404, 'Club not found');
    }
    res.status(200).json(club);
  } catch (error) {
    next(error);
  }
};

export const createClub: RequestHandler<unknown, unknown, CreateClubBody,unknown> = async (req, res, next) => {
  const { fullName, commonName, shortName, country, clubLogoUrl, stadium } = req.body;
  try {
    if(!fullName || !commonName || !shortName) {
      throw createHttpError(400, 'Club must have a full name, common name, and short name');
    }
    if(!country) {
      throw createHttpError(400, 'Club must have a country');
    }
    const newClub = await ClubModel.create({
      fullName,
      commonName,
      shortName,
      country,
      clubLogoUrl,
      stadium
    });
    res.status(201).json(newClub);
  } catch (error) {
    next(error);
  }
};

export const updateClub: RequestHandler<unknown, unknown, UpdateClubBody, unknown> = async (req, res, next) => {
  const clubToUpdate = req.body;
  
  try {
    if(!mongoose.isValidObjectId(clubToUpdate._id)) {
      throw(createHttpError(400, 'Invalid club id'));
    }
    if(!clubToUpdate.fullName || !clubToUpdate.commonName || !clubToUpdate.shortName) {
      throw createHttpError(400, 'Club must have a full name, common name, and short name');
    }
    if(!clubToUpdate.country) {
      throw createHttpError(400, 'Club must have a country');
    }
    const updatedClub = await ClubModel.findByIdAndUpdate(clubToUpdate._id, clubToUpdate);
    res.status(200).json(updatedClub);
  } catch (error) {
    next(error);
  }
};

export const deleteClub: RequestHandler = async (req, res, next) => {
  const { id, page, itemsPerPage } = req.query;
  
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid club id'));
    }

    await ClubModel.findByIdAndDelete(id);
    const data = await ClubModel.find().sort({ createdAt: -1 }).exec();

    res.status(200).json({
      clubs: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      clubsCount: data.length
    });
  } catch (error) {
    next(error);
  }
};