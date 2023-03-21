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