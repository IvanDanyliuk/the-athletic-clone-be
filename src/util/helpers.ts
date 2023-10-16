export const setQueryParams = (params: any) => {
  const modifiedParams = Object.entries(params).filter(item => item[1] !== '');
  return Object.fromEntries(modifiedParams);
};