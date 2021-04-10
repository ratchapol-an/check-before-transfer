/* eslint-disable import/prefer-default-export */
import { Role } from '@models/Role';
import axios from 'axios';

const API_FIREBASE_HOST =
  process.env.NEXT_PUBLIC_APP_STAGE === 'production'
    ? process.env.NEXT_PUBLIC_HOST_CLOUDFUNCTION_URL
    : 'http://localhost:5001/whoscheat-e2261/asia-southeast2';

export const addRole = async (uid: string, role: Role, token: string) => {
  await axios.post(
    `/api/admin/create`,
    {
      uid,
      role,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      baseURL: `${API_FIREBASE_HOST}`,
    },
  );
};
