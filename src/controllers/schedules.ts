import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import ScheduleModel from '../models/schedule';
import CompetitionModel from '../models/competition';
import { CompetitionType } from '../models/competition';
import { ClubType } from '../models/club';
import { ISchedulesFilterData, ISchedulesSortData } from '../types';
import { filterSchedules, sortSchedules } from '../util/helpers';


interface CreateScheduleBody {
  competition: CompetitionType,
  season: string,
  fixture: [
    {
      id: string,
      matchweekName: string,
      basicDate: string,
      games: {
        id: string,
        home: {
          club: ClubType,
          points: string,
        },
        away: {
          club: ClubType,
          points: string,
        },
        date: Date,
        location: string,
        score: string
      }[]
    }
  ]
}

interface GetAllSchedulesQuery {
  page: string,
  itemsPerPage: string,
  filterData?: ISchedulesFilterData,
  sortData?: ISchedulesSortData
}

export const getSchedules: RequestHandler<unknown, unknown, unknown, GetAllSchedulesQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;
  try {
    const data = await ScheduleModel
      .find()
      .sort({ createdAt: -1 })
      .populate([
        { 
          path: 'competition',
          populate: { path: 'clubs' }
        },
        {
          path: 'fixture',
          populate: [
            { path: 'games.home.club' },
            { path: 'games.away.club' }
          ]
        }
      ])
      .exec();
      

    let response;

    if(sortData) {
      response = sortSchedules(data, sortData);
    }

    if(filterData) {
      response = filterSchedules(data, filterData);
    }

    if(filterData && sortData) {
      const filteredData = filterSchedules(data, filterData);
      response = sortSchedules(filteredData, sortData);
    }

    if(!filterData && !sortData) {
      response = data;
    }

    if(page && itemsPerPage) {
      res.status(200).json({
        schedules: response?.slice(+itemsPerPage * +page, +itemsPerPage * (+page + 1)),
        schedulesCount: response ? response.length : data.length
      }); 
    } else {
      res.status(200).json(data); 
    }
  } catch (error) {
    next(error);
  }
};

interface GetScheduleQuery {
  season: string;
  leagueId: string;
}

export const getSchedule: RequestHandler<unknown, unknown, unknown, GetScheduleQuery> = async (req, res, next) => {
  const { season, leagueId } = req.query;
  try {
    if(!mongoose.isValidObjectId(leagueId)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }
    const schedule = await ScheduleModel
      .findOne({ $and: [{ season }, { competition: leagueId }] })
      .populate([
        { 
          path: 'competition',
          populate: { path: 'clubs' }
        },
        {
          path: 'fixture',
          populate: [
            { path: 'games.home.club' },
            { path: 'games.away.club' }
          ]
        }
      ])
      .exec();
    
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

    const competition = await CompetitionModel.findById(schedule.competition).populate('clubs');
    const modifiedSchedule = {
      ...schedule,
      competition: { ...competition }
    };

    const newSchedule = await ScheduleModel.create(modifiedSchedule);
    const response = await newSchedule.populate([
      { 
        path: 'competition',
        populate: { path: 'clubs' }
      },
      {
        path: 'fixture',
        populate: [
          { path: 'games.home.club' },
          { path: 'games.away.club' }
        ]
      }
    ])

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

interface UpdateScheduleBody {
  _id: string,
  competition: CompetitionType,
  season: string,
  fixture: [
    {
      id: string,
      matchweekName: string,
      basicDate: string, 
      games: {
        id: string,
        home: {
          club: ClubType,
          points: number,
        },
        away: {
          club: ClubType,
          points: number,
        },
        date: Date,
        location: string,
        score: string
      }[]
    }
  ]
}

export const updateSchedule: RequestHandler<unknown, unknown, UpdateScheduleBody, unknown> = async (req, res, next) => {
  const scheduleToUpdate = req.body;

  try {
    if(!mongoose.isValidObjectId(scheduleToUpdate._id)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }
    if(!scheduleToUpdate.competition) {
      throw createHttpError(400, 'Schedule must have a competition');
    }
    if(!scheduleToUpdate.season) {
      throw createHttpError(400, 'Schedule must have a season value');
    }

    const updatedSchedule = await ScheduleModel.findByIdAndUpdate(scheduleToUpdate._id, scheduleToUpdate);
    const response = await updatedSchedule!.populate([
      { 
        path: 'competition',
        populate: { path: 'clubs' }
      },
      {
        path: 'fixture',
        populate: [
          { path: 'games.home.club' },
          { path: 'games.away.club' }
        ]
      }
    ]);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule: RequestHandler = async (req, res, next) => {
  const { id, page, itemsPerPage } = req.query;

  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid schedule id'));
    }

    await ScheduleModel.findByIdAndDelete(id);

    const data = await ScheduleModel
      .find()
      .sort({ createdAt: -1 })
      .populate([
        { 
          path: 'competition',
          populate: { path: 'clubs' }
        },
        {
          path: 'fixture',
          populate: [
            { path: 'games.home.club' },
            { path: 'games.away.club' }
          ]
        }
      ])
      .exec();

    res.status(200).json({
      schedules: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      schedulesCount: data.length
    });
  } catch (error) {
    next(error);
  }
};