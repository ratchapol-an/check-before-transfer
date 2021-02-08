import Report, { mockReport } from 'models/Report';
import SearchBy from 'models/searchBy';

export const search = (value: string, by: SearchBy): Promise<Report[]> => {
  return Promise.resolve(value === '0945603070' ? [mockReport] : []);
};

export const addReport = () => {};
