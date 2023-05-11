import { ClubType } from '../models/club';
import { CompetitionType } from '../models/competition';
import { MaterialType } from '../models/material';
import { PlayerType } from '../models/player';
import { ScheduleType } from '../models/schedule';
import { UserType } from '../models/user';
import { IClubsFilterData, IClubsSortData, ICompetitionsFilterData, ICompetitionsSortData, IMaterialsFilterData, IMaterialsSortData, IPlayersFilterData, IPlayersSortData, ISchedulesFilterData, ISchedulesSortData, IUserFilterData, IUserSortData, Order } from '../types';


export const filterMaterials = (materials: MaterialType[], filterData: IMaterialsFilterData) => {
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


export const sortMaterials = (materials: MaterialType[], sortData: IMaterialsSortData) => {
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
      return a[indicator] > b[indicator] ? 1 : -1
    } else {
      return b[indicator] > a[indicator] ? 1 : -1;
    }
  });
};

export const filterClubs = (clubs: ClubType[], filterData: IClubsFilterData) => {
  const { country } = filterData;

  return clubs
    .filter(clubs => country ? clubs.country == country : true);
};


export const sortClubs = (clubs: ClubType[], sortData: IClubsSortData) => {
  const { indicator, order } = sortData;

  return clubs.sort((a: any, b: any) => {
    if(order === Order.asc) {
      return a[indicator] > b[indicator] ? 1 : -1;
    } else {
      return b[indicator] > a[indicator] ? 1 : -1;
    }
  });
};

export const filterCompetitions = (competitions: CompetitionType[], filterData: ICompetitionsFilterData) => {
  const { country, type } = filterData;

  return competitions
    .filter(competition => country ? competition.country == country : true)
    .filter(competition => type ? competition.type == type : true);
};


export const sortCompetitions = (competitions: CompetitionType[], sortData: ICompetitionsSortData) => {
  const { indicator, order } = sortData;

  return competitions.sort((a: any, b: any) => {
    if(order === Order.asc) {
      return a[indicator] > b[indicator] ? 1 : -1;
    } else {
      return b[indicator] > a[indicator] ? 1 : -1;
    }
  });
};

export const filterPlayers = (players: PlayerType[], filterData: IPlayersFilterData) => {
  const { club, country, dateFrom, dateTo, position } = filterData;

  return players
    .filter(player => club ? player.club == club : true)
    .filter(player => country ? player.country == country : true)
    .filter(player => position ? player.position == position : true)
    .filter(player => dateFrom && dateTo ? 
      Date.parse(player.birthDate.toISOString()) >= Date.parse(dateFrom!) && 
      Date.parse(player.birthDate.toISOString()) <= Date.parse(dateTo!) 
      : true
    );
};


export const sortPlayers = (players: PlayerType[], sortData: IPlayersSortData) => {
  const { indicator, order } = sortData;

  return players.sort((a: any, b: any) => {
    if(order === Order.asc) {
      return a[indicator] > b[indicator] ? 1 : -1;
    } else {
      return b[indicator] > a[indicator] ? 1 : -1;
    }
  });
};

export const filterSchedules = (schedules: ScheduleType[], filterData: ISchedulesFilterData) => {
  const { competition, country, season, dateFrom, dateTo } = filterData;

  return schedules
    .filter(schedule => country ? schedule.competition.country == country : true)
    .filter(schedule => competition ? schedule.competition._id == competition : true)
    .filter(schedule => season ? schedule.season === season : true)
    .filter(schedule => dateFrom && dateTo ? 
      Date.parse(schedule.createdAt.toISOString()) >= Date.parse(dateFrom!) && 
      Date.parse(schedule.createdAt.toISOString()) <= Date.parse(dateTo!) 
      : true
    );
};


export const sortSchedules = (schedules: ScheduleType[], sortData: ISchedulesSortData) => {
  const { indicator, order } = sortData;

  return schedules.sort((a: any, b: any) => {
    if(order === Order.asc) {
      switch(indicator) {
        case 'country':
          return a.competition.country > b.competition.country ? 1 : -1;
        case 'teamsNumber':
          return a.competition.clubs.length > b.competition.clubs.length ? 1 : -1;
        case 'type':
          return a.competition.type > b.competition.type ? 1 : -1;
        default:
          return a[indicator] > b[indicator] ? 1 : -1;
      }
    } else {
      switch(indicator) {
        case 'country':
          return b.competition.country > a.competition.country ? 1 : -1;
        case 'teamsNumber':
          return b.competition.clubs.length > a.competition.clubs.length ? 1 : -1;
        case 'type':
          return b.competition.type > a.competition.type ? 1 : -1;
        default:
          return b[indicator] > a[indicator] ? 1 : -1;
      }
    }
  });
};