import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
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
  } catch (e) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(404).send('Not Found');

    const ReportModel = Reports(db, Sequelize);
    const result = await ReportModel.findAndCountAll({
      where: {
        id,
      },
    });
    if (result.count === 0) return res.status(404).send('Not Found');

    return res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log(e);
    return res.status(404).send('Not Found');
  }
};

export default handler;
