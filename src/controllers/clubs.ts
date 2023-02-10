import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ClubModel from '../models/club';


interface CreateClubBody {
  fullName: string,
  commonName: string,
  shortName: string,
  country: string,
  clubLogoUrl?: string,
  stadium?: string
}

export const getClubs: RequestHandler = async (req, res, next) => {
  try {
    const clubs = await ClubModel.find().exec();
    res.status(200).json(clubs);  
  } catch (error) {
    next(error)
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

interface UpdateClubParams {
  id: string,
}

interface UpdateClubBody {
  fullName: string,
  commonName: string,
  shortName: string,
  country: string,
  clubLogoUrl?: string,
  stadium?: string
}

export const updateClub: RequestHandler<UpdateClubParams, unknown, UpdateClubBody, unknown> = async (req, res, next) => {
  const { id } = req.params;
  const clubToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid club id'));
    }
    if(!clubToUpdate.fullName || !clubToUpdate.commonName || !clubToUpdate.shortName) {
      throw createHttpError(400, 'Club must have a full name, common name, and short name');
    }
    if(!clubToUpdate.country) {
      throw createHttpError(400, 'Club must have a country');
    }
    const updatedClub = await ClubModel.findByIdAndUpdate(id, clubToUpdate);
    res.status(200).json(updatedClub);
  } catch (error) {
    next(error);
  }
};

export const deleteClub: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid club id'));
    }

    await ClubModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}