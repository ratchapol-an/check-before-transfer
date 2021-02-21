/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { firebaseAdmin, AuthVerifyToken } from './firebase';

export const validateToken = async (idToken: string): Promise<AuthVerifyToken | undefined> => {
  try {
    const decodedVerifyToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return decodedVerifyToken;
  } catch (e) {
    return undefined;
  }
};
export const validateIsAdmin = async (idToken: string): Promise<AuthVerifyToken | undefined> => {
  try {
    const decodedVerifyToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    if (decodedVerifyToken.superUser === true) return decodedVerifyToken;
    if (decodedVerifyToken.admin !== true) return undefined;
    return decodedVerifyToken;
  } catch (e) {
    console.log(e.response.message);
    return undefined;
  }
};

const validateIsSuperUser = async (idToken: string): Promise<boolean> => {
  try {
    const decodedVerifyToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    if (decodedVerifyToken.superUser !== true) return false;
    return true;
  } catch (e) {
    return false;
  }
};
export const getAuthorizationToken = (req: Request): string => {
  const { authorization } = req.headers;
  if (!authorization) return '';

  const split = authorization.split('Bearer ');
  return split[1];
};

export const createAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'POST') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);

  if (idToken === '') return res.status(401).send('Unauthorized');

  const isSuperUser = await validateIsSuperUser(idToken);
  if (!isSuperUser) return res.status(401).send('Unauthorized');

  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    await firebaseAdmin.auth().setCustomUserClaims(uid, role);

    return res.status(201).send({ uid });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
export const getAdminInfo = async (req: Request, res: Response): Promise<Response<any>> => {
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const isSuperUser = await validateIsSuperUser(idToken);
  if (!isSuperUser) return res.status(401).send('Unauthorized');

  const { params } = req;
  const adminUID = params.id;

  try {
    const admin = await firebaseAdmin.auth().getUser(adminUID);
    return res.status(200).send(admin);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
export default {};
