import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import CompetitionModel from '../models/competition';
import ClubModel from '../models/club';
import { CreateCompetitionBody, GetAllCompetitionsQuery, UpdateCompetitionBody } from '../types/competitions';


export const getCompetitions: RequestHandler<unknown, unknown, unknown, GetAllCompetitionsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;

  const order = !sortData || sortData.order === 'desc' ? -1 : 1;
  const sortIndicator = sortData ? sortData.indicator : 'createdAt';

  const query = filterData?.country && filterData.type ? 
    { country: filterData.country, type: filterData.type } :
    filterData?.country === '' && filterData.type ? 
      { type: filterData.type } : 
      filterData?.type === '' && filterData.country ?
        { country: filterData.country } : 
        {};

  try {
    const data = await CompetitionModel
      .find(query)
      .populate('clubs')
      .sort({ [sortIndicator]: order })
      .skip(+page * +itemsPerPage)
      .limit(+itemsPerPage)
      .exec();

    const count = filterData ? 
      await CompetitionModel.countDocuments({ 'country': filterData.country, 'type': filterData.type }) : 
      await CompetitionModel.countDocuments({});

    res.status(200).json({
      competitions: data,
      competitionsCount: count
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompetitions: RequestHandler = async (req, res, next) => {
  try {
    const competitions = await CompetitionModel.find().sort({ createdAt: -1 }).populate('clubs').exec();
    
    res.status(200).json({
      competitions,
      competitionsCount: competitions.length
    })
  } catch (error) {
    next(error);
  }
}

export const getCompetition: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid competition id'));
    }
    const competition = await CompetitionModel.findById(id).populate('clubs');
    if(!competition) {
      createHttpError(404, 'Competition not found');
    }

    res.status(200).json(competition);
  } catch (error) {
    next(error);
  }
};

export const createCompetition: RequestHandler<unknown, unknown, CreateCompetitionBody, unknown> = async (req, res, next) => {
  const competition = req.body;
  try {
    if(!competition.fullName) {
      throw createHttpError(400, 'Competition must have a name');
    }
    if(competition.clubs.length < 2) {
      throw createHttpError(400, 'Competition must have at least two clubs');
    }

    const clubIds = competition.clubs;
    const clubs = await ClubModel.find({ _id: { "$in": clubIds } }).exec();
    const addedCompetition = {
      ...competition,
      clubs
    };

    const newCompetition = await CompetitionModel.create(addedCompetition);
    res.status(201).json(newCompetition);
  } catch (error) {
    next(error);
  }
};

export const updateCompetition: RequestHandler<unknown, unknown, UpdateCompetitionBody, unknown> = async (req, res, next) => {
  const competitionToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(competitionToUpdate._id)) {
      throw(createHttpError(400, 'Invalid competition id'));
    }
    if(!competitionToUpdate.fullName) {
      throw createHttpError(400, 'Competition must have a name');
    }
    if(competitionToUpdate.clubs.length < 2) {
      throw createHttpError(400, 'Competition must have at least two clubs');
    }

    const clubIds = competitionToUpdate.clubs;
    const clubs = await ClubModel.find({ _id: { "$in": clubIds } }).exec();

    const addedCompetition = {
      ...competitionToUpdate,
      clubs
    };

    const updatedCompetition = await CompetitionModel.findByIdAndUpdate(competitionToUpdate._id, addedCompetition).populate('clubs');
    
    res.status(200).json(updatedCompetition);
  } catch (error) {
    next(error);
  }
};

export const deleteCompetition: RequestHandler = async (req, res, next) => {
  const { id } = req.query;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid competition id'));
    }

    await CompetitionModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};