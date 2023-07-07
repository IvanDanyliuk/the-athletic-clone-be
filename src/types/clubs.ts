import { Order } from './common';


export interface CreateClubBody {
  fullName: string;
  commonName: string;
  shortName: string;
  country: string;
  clubLogoUrl?: string;
  stadium?: string;
}

export interface GetAllClubsQuery {
  page: string;
  itemsPerPage: string;
  filterData?: IClubsFilterData;
  sortData?: IClubsSortData;
}

export interface UpdateClubBody {
  _id: string;
  fullName: string;
  commonName: string;
  shortName: string;
  country: string;
  clubLogoUrl?: string;
  stadium?: string;
}

export interface IClubsFilterData {
  country?: string;
}

export interface IClubsSortData {
  indicator: string;
  order: Order;
}

export interface IClub {
  _id: string;
  fullName: string;
  commonName: string;
  shortName: string;
  country: string;
  clubLogoUrl: string;
  stadium: string;
  createdAt: Date;
  updatedAt: Date;
}