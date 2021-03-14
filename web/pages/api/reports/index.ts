/* eslint-disable */
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@db/index';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();
type ReportModel = typeof db & { report: any };
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
    const dbReport = db as ReportModel;
    const ReportModel = dbReport.report;

    switch (req.method) {
      case 'DELETE': {
        const { reportId } = req.body;

        await ReportModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              id: reportId,
            },
          },
        );
        return res.status(200).json({
          reporterID,
          status: 'deleted',
        });
      }
      case 'GET': {
        const { offset, limit } = req.query;
        const result = await ReportModel.findAndCountAll({
          where: {
            reporterID,
            isDeleted: false,
          },
          offset: parseInt(offset as string, 10) || 0,
          limit: parseInt(limit as string, 10) || 10,
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
