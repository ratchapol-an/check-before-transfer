/* eslint-disable import/prefer-default-export */

import jwt from 'jsonwebtoken';
import moment from 'moment';

const numberFormatter = new Intl.NumberFormat('th-TH');
export const formatAmount = (value: number) => `${numberFormatter.format(value)} บาท`;

export const formatDate = (value: string) => moment(value).format('LL');

export const parseToken = (token: string): { [key: string]: any } => {
  const data = jwt.decode(token);
  return data as { [key: string]: any };
};
