/* eslint-disable import/prefer-default-export */

import { notification } from 'antd';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { AuthUser } from 'next-firebase-auth';

const numberFormatter = new Intl.NumberFormat('th-TH');
export const formatAmount = (value: number) => `${numberFormatter.format(value)} บาท`;

export const formatDate = (value: string) => moment(value).format('LL');

type DecodedToken = {
  superUser: boolean;
  admin: boolean;
};

export const parseToken = (token: string): DecodedToken => {
  const data = jwt.decode(token);
  return data as DecodedToken;
};

export const isAdminRole = (token: string | null) => {
  if (!token) {
    return false;
  }
  const decodedToken = parseToken(token);

  return decodedToken.admin === true || decodedToken.superUser === true;
};

export const notifyError = () => {
  notification.error({
    message: 'บันทึกข้อมูลไม่สำเร็จ',
    description: 'ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
  });
};
