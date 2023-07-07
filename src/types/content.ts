import { MaterialType } from '../models/material';


export interface CreateContentSectionBody {
  name: string;
  maxLength: number;
  materials: MaterialType[];
}

export interface UpdateContentSectionBody {
  _id: string;
  name: string;
  maxLength: number;
  materials: MaterialType[];
}