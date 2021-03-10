import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import jwt from 'jsonwebtoken';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');
  let reporterID = '';

  try {
    const user = await verifyIdToken(idToken);
    reporterID = user.id as string;
    const decodedVerifyToken = jwt.decode(idToken) as { [key: string]: any };
    if (decodedVerifyToken.superUser !== true) {
      if (decodedVerifyToken.admin !== true) Promise.reject();
    }
  } catch (e) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { status, offset, limit } = req.query;

    const searchStatus = status || 1;

    const ReportModel = Reports(db, Sequelize);

    const result = await ReportModel.findAndCountAll({
      where: {
        status: searchStatus,
        isDeleted: false,
      },
      offset: parseInt(offset as string, 10),
      limit: parseInt(limit as string, 10),
      order: [['createdAt', 'DESC']],
    });

    const resp = { total: result.count, data: result.rows };

    return res.status(200).json(resp);
  } catch (e) {
    console.log(e);
    return res.status(401).send('Unauthorized');
  }
};

export default handler;
