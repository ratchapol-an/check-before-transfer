/* eslint-disable */
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@db/index';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

type ReportModel = typeof db & { Report: any };
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  initAuth();
  switch (req.method) {
    case 'DELETE':
    case 'GET':
      break;
    default: {
      res.status(403).send('Forbidden!');
      return;
    }
  }

  const idToken = getAuthorizationToken(req);
  if (idToken === '') {
    res.status(401).send('Unauthorized');
    return;
  }
  let reporterID = '';
  try {
    const user = await verifyIdToken(idToken);
    reporterID = user.id as string;
  } catch (e) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const dbReport = db as ReportModel;
    console.log('dbReport'), dbReport;
    const ReportModel = dbReport.Report;

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
        res.status(200).json({
          reporterID,
          status: 'deleted',
        });
        return;
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
        res.status(200).json({
          total: result.count,
          data: result.rows,
        });
        return;
      }
      default: {
        res.status(403).send('Forbidden!');
        return;
      }
    }
  } catch (e) {
    console.log(e);
    res.status(401).send('Unauthorized');
    return;
  }
};

export default handler;
