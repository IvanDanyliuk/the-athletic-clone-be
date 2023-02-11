import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ScheduleModel from '../models/schedule';
import { CompetitionType } from '../models/competition';
import { ClubType } from '../models/club';


interface CreateScheduleBody {
  competition: CompetitionType,
  tournament: {
    groupStage: [
      {
        groupIndex: string,
        teams: ClubType[],
        games: [
          {
            home: ClubType,
            away: ClubType,
            date: Date,
            location: string,
            score: string
          },
        ],
      },
    ],
    knockoutStage: [
      {
        stageName: string,
        teams: ClubType[],
        games: [
          {
            home: ClubType,
            away: ClubType,
            date: Date,
            location: string,
            score: string
          },
        ],
      },
    ],
  },
  league: [
    {
      matchweekName: string,
      home: ClubType[],
      away: ClubType[],
      date: Date,
      location: string,
      score: string
    }
  ]
}

export const getSchedules: RequestHandler = async (req, res, next) => {
  try {
    const schedules = await ScheduleModel.find().exec();
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

export const getSchedule: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }
    const schedule = await ScheduleModel.findById(id);
    if(!schedule) {
      createHttpError(404, 'Schedule not found');
    }
    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

export const createSchedule: RequestHandler<unknown, unknown, CreateScheduleBody, unknown> = async (req, res, next) => {
  const schedule = req.body;
  try {
    if(!schedule.competition) {
      throw createHttpError(400, 'Schedule must have a competition');
    }
    const newSchedule = await ScheduleModel.create(schedule);
    res.status(201).json(newSchedule);
  } catch (error) {
    next(error);
  }
};

interface UpdateScheduleParams {
  id: string,
}

interface UpdateScheduleBody {
  competition: CompetitionType,
  tournament: {
    groupStage: [
      {
        groupIndex: string,
        teams: ClubType[],
        games: [
          {
            home: ClubType,
            away: ClubType,
            date: Date,
            location: string,
            score: string
          },
        ],
      },
    ],
    knockoutStage: [
      {
        stageName: string,
        teams: ClubType[],
        games: [
          {
            home: ClubType,
            away: ClubType,
            date: Date,
            location: string,
            score: string
          },
        ],
      },
    ],
  },
  league: [
    {
      matchweekName: string,
      home: ClubType[],
      away: ClubType[],
      date: Date,
      location: string,
      score: string
    }
  ]
}

export const updateSchedule: RequestHandler<UpdateScheduleParams, unknown, UpdateScheduleBody, unknown> = async (req, res, next) => {
  const { id } = req.params;
  const scheduleToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }
    if(!scheduleToUpdate.competition) {
      throw createHttpError(400, 'Schedule must have a competition');
    }

    const updatedSchedule = await ScheduleModel.findByIdAndUpdate(id, scheduleToUpdate);
    res.status(200).json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }

    await ScheduleModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};