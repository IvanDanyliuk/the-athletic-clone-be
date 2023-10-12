import { Order } from './common';
import { UpdateUserBody } from './users';


export interface CreateMaterialBody {
  // author: { 
  //   name: string;
  //   photoUrl?: string;
  //   organization: string;
  //   position: string;
  // };
  author: string;
  type: string;
  title?: string;
  content: string;
  preview?: string;
  image?: string;
  isMain?: boolean;
  status: string;
  views: number;
  likes: string[];
  publicationDate: string | any;
  comments: {
    user: string;
    message: string;
  }[];
  labels: string[];
}

export interface GetAllMaterialsQuery {
  page: string;
  itemsPerPage: string;
  filterData?: IMaterialsFilterData;
  sortData?: IMaterialsSortData;
}

export interface GetRecentMaterialsQuery {
  materialsNumber: number;
  materialTypes: string[];
}

export interface GetSecondaryMaterialsQuery {
  topMaterialsNum: number;
  postsNum: number;
}

export interface GetFilterValues {
  value: string;
}

export interface SearchMaterials {
  value: string | string[];
  type: string | string[];
  materialsNum?: number;
}

export interface UpdateMaterialBody {
  _id: string;
  // author: { 
  //   name: string;
  //   photoUrl?: string;
  //   organization: string;
  //   position: string;
  // };
  author: UpdateUserBody;
  type: string;
  title?: string;
  content: string;
  preview?: string;
  image?: string;
  isMain?: boolean;
  status: string;
  views: number;
  likes: string[];
  publicationDate: string | any;
  comments: {
    user: string;
    message: string;
  }[];
  labels: string[];
}

export interface IMaterialsFilterData {
  author?: string;
  dateFrom?: string;
  dateTo?: string; 
  type?: string;
}

export interface IMaterialsSortData {
  indicator: string;
  order: Order;
}