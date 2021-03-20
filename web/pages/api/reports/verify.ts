import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import firebaseAdmin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from 'sib-api-v3-typescript';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

const transactionalEmailApi = new TransactionalEmailsApi();
console.log(process.env.EMAIL_API_KEY);
transactionalEmailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.EMAIL_API_KEY || '');

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  try {
    await verifyIdToken(idToken);
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

    const resp = await ReportModel.findByPk(parseInt(reportId, 10));
    if (!resp) return res.status(404).json({});
    const reporterID = resp.getDataValue('reporterID');
    const reporter = await firebaseAdmin.auth().getUser(reporterID);

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
    if (reporter.email && status === 4) {
      const emailResp = await transactionalEmailApi.sendTransacEmail({
        to: [{ email: reporter.email }],
        params: { reportLink: `https://check-before-transfer.vercel.app/report/${reportId}` },
      });
      console.log('emailResp', emailResp);
    }
    return res.status(200).json({
      reportId,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Error');
  }
};

export default handler;
