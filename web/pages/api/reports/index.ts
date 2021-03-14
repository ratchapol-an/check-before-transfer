/* eslint-disable */
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@db/index';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

type ReportModel = typeof db & { Report: any };

initAuth();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT': {
      res.status(200);
      res.json('PUT TEST');
      return;
    }
    case 'GET':
    case 'DELETE':
      break;
    default: {
      res.status(403);
      res.send('Forbidden!');
      return;
    }
  }

  const idToken = getAuthorizationToken(req);
  if (idToken === '') {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  let reporterID = '';
  try {
    const user = await verifyIdToken(idToken);
    reporterID = user.id as string;
  } catch (e) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  let resp: any = {};
  let respCode = 200;

  try {
    const dbReport = db as ReportModel;
    console.log('dbReport');
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
        respCode = 200;
        resp = {
          reporterID,
          status: 'deleted',
        };
        break;
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

        respCode = 200;
        resp = {
          total: result.count,
          data: result.rows,
        };
        break;
      }
      default: {
        respCode = 403;
        resp = {
          message: 'Forbidden',
        };
        break;
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('Internal error');
    return;
  }
  res.status(respCode);
  res.json(resp);
};
