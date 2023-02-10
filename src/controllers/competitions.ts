import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import CompetitionModel from '../models/competition';
import { ClubType } from '../models/club';


interface CreateCompetitionBody {
  fullName: string,
  shortName: string,
  country: string,
  clubs: ClubType[],
  logoUrl: string,
  type: string,
}

export const getCompetitions: RequestHandler = async (req, res, next) => {
  try {
    const competitions = await CompetitionModel.find().exec();
    res.status(200).json(competitions);
  } catch (error) {
    next(error);
  }
};

export const getCompetition: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid competition id'));
    }
    const competition = await CompetitionModel.findById(id);
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

    const newCompetition = await CompetitionModel.create(competition);
    res.status(201).json(newCompetition);
  } catch (error) {
    next(error);
  }
};

interface UpdateCompetitionParams {
  id: string,
}

interface UpdateCompetitionBody {
  fullName: string,
  shortName: string,
  country: string,
  clubs: ClubType[],
  logoUrl: string,
  type: string,
}

export const updateCompetition: RequestHandler<UpdateCompetitionParams, unknown, UpdateCompetitionBody, unknown> = async (req, res, next) => {
  const { id } = req.params;
  const competitionToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid competition id'));
    }
    if(!competitionToUpdate.fullName) {
      throw createHttpError(400, 'Competition must have a name');
    }
    if(competitionToUpdate.clubs.length < 2) {
      throw createHttpError(400, 'Competition must have at least two clubs');
    }
    const updatedCompetition = await CompetitionModel.findByIdAndUpdate(id, competitionToUpdate);
    res.status(200).json(updatedCompetition);
  } catch (error) {
    next(error);
  }
};

export const deleteCompetition: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

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