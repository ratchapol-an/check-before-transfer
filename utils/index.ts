/* eslint-disable import/prefer-default-export */

import jwt from 'jsonwebtoken';

const numberFormatter = new Intl.NumberFormat('th-TH');
export const formatAmount = (value: number) => `${numberFormatter.format(value)} บาท`;

const datetimeFormatter = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatDate = (value: string) => datetimeFormatter.format(new Date(value));

export const parseToken = (token: string): { [key: string]: any } => {
  const data = jwt.decode(token);
  return data as { [key: string]: any };
  // return objectSnakeCaseToCamelCase(data);
};
