import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import PlayerModel from '../models/palyer';
import { ClubType } from '../models/club';


interface CreatePlayerBody {
  firstName: string,
  lastName: string,
  birthDate: string,
  country: string,
  photoUrl?: string | undefined,
  number?: number | undefined,
  position: string,
  club?: ClubType | undefined,
}

export const getPlayers: RequestHandler = async (req, res, next) => {
  try {
    const players = await PlayerModel.find().exec();
    res.status(200).json(players);
  } catch (error) {
    next(error);
  }
};

export const getPlayer: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid player id'));
    }
    const player = await PlayerModel.findById(id);
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};

export const createPlayer: RequestHandler<unknown, unknown, CreatePlayerBody, unknown> = async (req, res, next) => {
  const player = req.body;
  try {
    if(!player.firstName || !player.lastName) {
      throw createHttpError(400, 'Player must have first name and last name');
    }
    if(!player.birthDate) {
      throw createHttpError(400, 'Player must have a birth date');
    }
    if(!player.country) {
      throw createHttpError(400, 'Player must have a country');
    }
    if(!player.position) {
      throw createHttpError(400, 'Player must have a position');
    }

    const newPlayer = await PlayerModel.create(player);
    res.status(201).json(newPlayer);
  } catch (error) {
    next(error);
  }
};

interface UpdatePlayerParams {
  id: string,
}

interface UpdatePlayerBody {
  firstName: string,
  lastName: string,
  birthDate: string,
  country: string,
  photoUrl?: string | undefined,
  number?: number | undefined,
  position: string,
  club?: ClubType | undefined,
}

export const updatePlayer: RequestHandler<UpdatePlayerParams, unknown, UpdatePlayerBody, unknown> = async (req, res, next) => {
  const { id } = req.params;
  const playerToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid player id'));
    }
    if(!playerToUpdate.firstName || !playerToUpdate.lastName) {
      throw createHttpError(400, 'Player must have first name and last name');
    }
    if(!playerToUpdate.birthDate) {
      throw createHttpError(400, 'Player must have a birth date');
    }
    if(!playerToUpdate.country) {
      throw createHttpError(400, 'Player must have a country');
    }
    if(!playerToUpdate.position) {
      throw createHttpError(400, 'Player must have a position');
    }

    const updatedPlayer = await PlayerModel.findByIdAndUpdate(id, playerToUpdate);
    res.status(200).json(updatedPlayer);
  } catch (error) {
    next(error);
  }
};

export const deletePlayer: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid player id'));
    }

    await PlayerModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};