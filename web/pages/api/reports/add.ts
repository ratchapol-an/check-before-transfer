import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(403).send('Forbidden!');
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

    const report = req.body;
    const resp = await ReportModel.create({
      name: report.name,
      amount: report.amount,
      eventDetail: report.eventDetail,
      reporterID,
      paymentMethod: report.paymentMethod,
      productType: report.productType,
      productLink: report.productLink,
      bankCode: report.bankCode,
      bankAccountNo: report.bankAccountNo,
      phoneNumber: report.phoneNumber,
      idNumber: report.idNumber,
      eventDate: report.eventDate,
      status: 1,
      attachedFiles: report.attachedFiles,
      isDeleted: false,
    });
    return res.status(200).json({ success: resp.toJSON() });
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Error');
  }
};

export default handler;
