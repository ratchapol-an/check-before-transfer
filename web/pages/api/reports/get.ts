import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import initAuth from '../../../services/firebaseService';

initAuth();
enum SearchField {
  Payment = 'paymentMethod',
  PhoneNumber = 'phoneNumber',
  nationalID = 'idNumber',
  Name = 'name',
}

const getSearchQuery = (searchBy: string): string => {
  switch (searchBy) {
    case 'bank-account':
      return SearchField.Payment;
    case 'phone':
      return SearchField.PhoneNumber;
    case 'id-number':
      return SearchField.nationalID;
    case 'name':
      return SearchField.Name;
    default:
      return '';
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(403).send('Forbidden!');

  const { q, by } = req.query;
  console.log(q, by);

  const searchQuery = getSearchQuery(by as string);

  if (searchQuery === '') return res.status(404).send('Missing search by');

  try {
    const ReportModel = Reports(db, Sequelize);
    const result = await ReportModel.findAndCountAll({
      where: {
        [searchQuery]: q,
        isDeleted: false,
      },
      order: [['createdAt', 'DESC']],
    });
    const totalReport = result.count;
    if (result.count === 0) return res.status(200).send(null);

    let totalDamagedPrice = 0;
    result.rows.forEach((r) => {
      totalDamagedPrice += r.getDataValue('amount');
    });

    console.log({
      name: q,
      totalReport,
      totalDamagedPrice,
      lastedReport: result.rows[0],
    });

    return res.status(200).json({
      name: q,
      totalReport,
      totalDamagedPrice,
      lastedReport: result.rows[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send('Intenal Error');
  }
};

export default handler;
