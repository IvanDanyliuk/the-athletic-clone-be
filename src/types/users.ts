import { Order } from './common';


export interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userPhotoUrl?: string;
  role?: string;
  location?: string;
  organization?: string;
  position?: string;
}

export interface LoginBody {
  email?: string;
  password?: string;
}

export interface CreateUserBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userPhotoUrl?: string;
  role?: string;
  location?: string;
  organization?: string;
  position?: string;
}

export interface GetAllUsersQuery {
  page: string;
  itemsPerPage: string;
  filterData?: IUserFilterData;
  sortData?: IUserSortData;
}

export interface UpdateUserBody {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  userPhotoUrl?: string;
  role: string;
  location?: string;
  organization?: string;
  position?: string;
}

export interface IUserFilterData {
  role?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IUserSortData {
  indicator: string;
  order: Order;
}