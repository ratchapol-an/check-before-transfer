import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import { verifyIdToken } from 'next-firebase-auth';
import initAuth, { getAuthorizationToken } from '../../../services/firebaseService';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  try {
    const user = await verifyIdToken(idToken);
    console.log('user', user);
    const reporterID = user.id;

    const ReportModel = Reports(db, Sequelize);

    const report = req.body;
    const [i] = await ReportModel.update(
      {
        name: report.name,
        amount: report.amount,
        eventDetail: report.eventDetail,
        reporterID,
        paymentMethod: report.paymentMethod,
        productType: report.productType,
        productLink: report.productLink,
        bankCode: report.bankCode,
        bankAccountNumber: report.bankAccountNumber,
        phoneNumber: report.phoneNumber,
        nationalIdNumber: report.nationalIdNumber,
        eventDate: report.eventDate,
        status: 1,
        attachedFiles: report.attachedFiles,
      },
      {
        where: {
          id: report.id,
        },
      },
    );
    return res.status(200).json({ success: i });
  } catch (e) {
    console.log(e);
    return res.status(401).send('Unauthorized');
  }
};

export default handler;
