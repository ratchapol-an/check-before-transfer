import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import jwt from 'jsonwebtoken';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from 'sib-api-v3-typescript';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

const transactionalEmailApi = new TransactionalEmailsApi();
transactionalEmailApi.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  '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',
);
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
    const { reportId, status } = req.body;
    const ReportModel = Reports(db, Sequelize);

    const [i] = await ReportModel.update(
      {
        status,
      },
      {
        where: {
          id: reportId,
        },
      },
    );
    // transactionalEmailApi.sendTransacEmail({to: [{ email: ''}], params: {reportLink: `https://check-before-transfer.vercel.app/report/${reportId}`}})
    return res.status(200).json({
      reportId,
    });
  } catch (e) {
    return res.status(500).send('Internal Error');
  }
};

export default handler;
