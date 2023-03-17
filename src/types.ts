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