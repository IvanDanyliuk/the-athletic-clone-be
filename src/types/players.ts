import { ClubType } from '../models/club';
import { Order } from './common';
import { IClub } from './clubs';


export interface CreatePlayerBody {
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  photoUrl?: string | undefined;
  number?: number | undefined;
  position: string;
  club?: string;
}

export interface GetAllPlayersQuery {
  page: string;
  itemsPerPage: string;
  filterData?: IPlayersFilterData;
  sortData?: IPlayersSortData;
}

export interface UpdatePlayerBody {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  photoUrl?: string | undefined;
  number?: number | undefined;
  position: string;
  club?: ClubType | undefined;
  createdAt: string;
}

export interface IPlayersFilterData {
  club?: string;
  position?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IPlayersSortData {
  indicator: string;
  order: Order;
}

export interface IPlayer {
  firstName: string;
  lastName: string;
  birthDate: Date;
  country: string;
  photoUrl?: string;
  number: string;
  position: string;
  club: IClub;
  createdAt: Date;
  updatedAt: Date;
}