import { ClubType } from '../models/club';
import { Order } from './common';


export interface CreateCompetitionBody {
  fullName: string;
  shortName: string;
  country: string;
  clubs: ClubType[];
  logoUrl: string;
  type: string;
}

export interface GetAllCompetitionsQuery {
  page: string;
  itemsPerPage: string;
  filterData?: ICompetitionsFilterData;
  sortData?: ICompetitionsSortData;
}

export interface ICompetitionsFilterData {
  country?: string;
  type?: string;
}

export interface ICompetitionsSortData {
  indicator: string;
  order: Order;
}

export interface UpdateCompetitionBody {
  _id: string;
  fullName: string;
  shortName: string;
  country: string;
  clubs: ClubType[];
  logoUrl: string;
  type: string;
  createdAt: string;
}