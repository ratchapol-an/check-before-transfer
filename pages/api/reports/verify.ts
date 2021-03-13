import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import jwt from 'jsonwebtoken';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
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
    const { reportID, status } = req.body;
    const ReportModel = Reports(db, Sequelize);

    const [i] = await ReportModel.update(
      {
        status,
      },
      {
        where: {
          id: reportID,
        },
      },
    );
    return res.status(200).json({
      reportID,
    });
  } catch (e) {
    return res.status(500).send('Internal Error');
  }
};

export default handler;