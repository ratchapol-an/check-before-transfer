import { NextApiRequest, NextApiResponse } from 'next';
import Sequelize from 'sequelize';
import { sequelize as db } from '@db/index';
import Reports from '@db/report';
import initAuth from '../../../services/firebaseService';

initAuth();
enum SearchField {
  BankAccountNo = 'bankAccountNo',
  PhoneNumber = 'phoneNumber',
  NationalID = 'idNumber',
  Name = 'name',
}

const getSearchBy = (searchBy: string): string => {
  switch (searchBy) {
    case 'bank-account':
      return SearchField.BankAccountNo;
    case 'phone':
      return SearchField.PhoneNumber;
    case 'id-number':
      return SearchField.NationalID;
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

  const searchBy = getSearchBy(by as string);
  let searchQuery = typeof q === 'string' ? q : q[0];
  if (searchBy === '') return res.status(404).send('Missing search by');
  if (searchBy !== SearchField.Name) {
    searchQuery = searchQuery.replace(/\s|-/g, '');
  } else {
    searchQuery = searchQuery.replace(/  +/g, ' ');
  }

  try {
    const ReportModel = Reports(db, Sequelize);
    // const { Op } = Sequelize;

    const result = await ReportModel.findAndCountAll({
      where: {
        [searchBy]: searchQuery,
        isDeleted: false,
      },
      order: [['eventDate', 'DESC']],
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
