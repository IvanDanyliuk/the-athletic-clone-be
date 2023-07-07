import { ClubType } from '../models/club';
import { CompetitionType } from '../models/competition';
import { Order } from './common';


export interface CreateScheduleBody {
  competition: CompetitionType;
  season: string;
  fixture: [
    {
      id: string;
      matchweekName: string;
      basicDate: string;
      games: {
        id: string;
        home: {
          club: ClubType;
          points: string;
          goalsFor: string;
          goalsAgainst: string;
          final: string;
        };
        away: {
          club: ClubType;
          points: string;
          goalsFor: string;
          goalsAgainst: string;
          final: string;
        };
        date: Date;
        location: string;
        score: string;
      }[];
    }
  ];
}

export interface GetAllSchedulesQuery {
  page: string;
  itemsPerPage: string;
  filterData?: ISchedulesFilterData;
  sortData?: ISchedulesSortData;
}

export interface GetSchedulesByClubQuery {
  season: string;
  clubId: string;
}

export interface GetScheduleQuery {
  season: string;
  leagueId: string;
}

export interface GetRecentMatchesQuery {
  season: string;
}

export interface UpdateScheduleBody {
  _id: string;
  competition: CompetitionType;
  season: string;
  fixture: [
    {
      id: string;
      matchweekName: string;
      basicDate: string; 
      games: {
        id: string;
        home: {
          club: ClubType;
          points: number;
          goalsFor: string;
          goalsAgainst: string;
          final: string;
        };
        away: {
          club: ClubType;
          points: number;
          goalsFor: string;
          goalsAgainst: string;
          final: string;
        };
        date: Date;
        location: string;
        score: string;
      }[];
    }
  ];
}

export interface ISchedulesFilterData {
  competition?: string;
  country?: string;
  season?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ISchedulesSortData {
  indicator: string;
  order: Order;
}