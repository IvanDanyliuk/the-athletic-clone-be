import { Material } from '../models/material';
import { UserType } from '../models/user';
import { IMaterialsFilterData, IMaterialsSortData, IUserFilterData, IUserSortData, Order } from '../types';


export const filterMaterials = (materials: Material[], filterData: IMaterialsFilterData) => {
  const { author, type, dateFrom, dateTo } = filterData;

  return materials
    .filter(material => type ? material.type == type : true)
    .filter(material => author ? material.author?.name == author : true)
    .filter(material => dateFrom && dateTo ? 
      Date.parse(material.createdAt.toISOString()) >= Date.parse(dateFrom!) && 
      Date.parse(material.createdAt.toISOString()) <= Date.parse(dateTo!) 
      : true
    );
};


export const sortMaterials = (materials: Material[], sortData: IMaterialsSortData) => {
  const { indicator, order } = sortData;

  return materials.sort((a: any, b: any) => {
    if(order === Order.asc) {
      if(indicator === 'author') {
        return a.author.name > b.author.name ? 1 : -1
      } else {
        return a[indicator] > b[indicator] ? 1 : -1
      }
    } else {
      if(indicator === 'author') {
        return b.author.name > a.author.name ? 1 : -1
      } else {
        return b[indicator] > a[indicator] ? 1 : -1
      }
    }
  });
};

export const filterUsers = (users: UserType[], filterData: IUserFilterData) => {
  const { location, role, dateFrom, dateTo } = filterData;

  return users
    .filter(user => location ? user.location == location : true)
    .filter(user => role ? user.role == role : true)
    .filter(user => dateFrom && dateTo ? 
      Date.parse(user.createdAt.toISOString()) >= Date.parse(dateFrom!) && 
      Date.parse(user.createdAt.toISOString()) <= Date.parse(dateTo!) 
      : true
    );
};

export const sortUsers = (users: UserType[], sortData: IUserSortData) => {
  const { indicator, order } = sortData;

  return users.sort((a: any, b: any) => {
    if(order === Order.asc) {
      // if(indicator === 'author') {
      //   return a.author.name > b.author.name ? 1 : -1
      // } else {
        return a[indicator] > b[indicator] ? 1 : -1
      // }
    } else {
      // if(indicator === 'author') {
      //   return b.author.name > a.author.name ? 1 : -1
      // } else {
        return b[indicator] > a[indicator] ? 1 : -1
      // }
    }
  });
};