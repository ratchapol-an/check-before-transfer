import { SearchBy } from '../types';

export const getSearchQuery = (searchBy: string): string => {
  switch (searchBy) {
    case 'bank-account':
      return SearchBy.Payment;
    case 'phone':
      return SearchBy.PhoneNumber;
    case 'id-number':
      return SearchBy.nationalID;
    case 'name':
      return SearchBy.Name;
    default:
      return '';
  }
};
export default {};
