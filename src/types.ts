import { ObjectId } from "mongoose"
import { ClubType } from "./models/club"
import { CompetitionType } from "./models/competition"

export interface IMaterialsFilterData {
  author?: string,
  dateFrom?: string,
  dateTo?: string, 
  type?: string
}

export interface IMaterialsSortData {
  indicator: string,
  order: Order
}

export enum Order {
  asc = 'asc',
  desc = 'desc'
}

export interface IUserFilterData {
  role?: string,
  location?: string,
  dateFrom?: string,
  dateTo?: string
}

export interface IUserSortData {
  indicator: string,
  order: Order
}

export interface IClubsFilterData {
  country?: string,
}

export interface IClubsSortData {
  indicator: string,
  order: Order
}

export interface ICompetitionsFilterData {
  country?: string,
  type?: string
}

export interface ICompetitionsSortData {
  indicator: string,
  order: Order
}

export interface IPlayersFilterData {
  club?: string,
  position?: string,
  country?: string,
  dateFrom?: string,
  dateTo?: string,
}

export interface IPlayersSortData {
  indicator: string,
  order: Order
}

export interface ISchedulesFilterData {
  competition?: string,
  country?: string,
  season?: string,
  dateFrom?: string,
  dateTo?: string
}

export interface ISchedulesSortData {
  indicator: string,
  order: Order
}

export interface IClub {
  _id: string,
  fullName: string,
  commonName: string,
  shortName: string,
  country: string,
  clubLogoUrl: string,
  stadium: string
  createdAt: Date,
  updatedAt: Date
}

export interface IPlayer {
  firstName: string,
  lastName: string,
  birthDate: Date,
  country: string,
  photoUrl?: string,
  number: string,
  position: string,
  club: IClub,
  createdAt: Date,
  updatedAt: Date
}