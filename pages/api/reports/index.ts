import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE':
    case 'GET':
      break;
    default:
      return res.status(403).send('Forbidden!');
  }

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
    const ReportModel = Reports(db, Sequelize);

    switch (req.method) {
      case 'DELETE': {
        const { reportID } = req.body;

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
      }
      case 'GET': {
        const result = await ReportModel.findAndCountAll({
          where: {
            reporterID,
            isDeleted: false,
          },
          order: [['createdAt', 'DESC']],
        });
        return res.status(200).json({
          total: result.count,
          data: result.rows,
        });
      }
      default:
        return res.status(403).send('Forbidden!');
    }
  } catch (e) {
    console.log(e);
    return res.status(401).send('Unauthorized');
  }
};

export default handler;
