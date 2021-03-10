import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  try {
    const user = await verifyIdToken(idToken);

    const reporterID = user.id;
    const { reportID } = req.body;

    const ReportModel = Reports(db, Sequelize);

    await ReportModel.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: reportID,
        },
      },
    );
    return res.status(200).json({
      reporterID,
      status: 'deleted',
    });
  } catch (e) {
    console.log(e);
    return res.status(401).send('Unauthorized');
  }
};

export default handler;
