/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from 'firebase-functions';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { firebaseAdmin, db } from './firebase';
import { saveHistory } from './history';
import { getSearchQuery } from './search';
import { Report, ActionType } from '../types';

const REPORT_COLLECTION = 'reports';

export const addReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'POST') return res.status(403).send('Forbidden!');
  const { body } = req;
  const reporterID = body.reporter_id;
  const newReport: Report = {
    bankCode: body.bank_code,
    bankAccountNumber: body.bank_account_number,
    name: body.name,
    phoneNumber: body.phone_number,
    nationalIdNumber: body.national_id_number,
    amount: body.amount,
    eventDate: body.event_date,
    eventDetail: body.event_detail,
    reporterId: body.reporter_id,
    paymentMethod: body.payment_method,
    productLink: body.product_link,
    status: 1,
    document: [],
    created_at: firebaseAdmin.firestore.Timestamp.fromDate(dayjs().toDate()),
  };
  try {
    const writeResult = await db.collection(REPORT_COLLECTION).add(newReport);
    const reportID = writeResult.id;
    await saveHistory(reporterID, ActionType.CREATE, reportID, {}, newReport, db);
    functions.logger.info(`Add report ${reportID} by ${reporterID}`, { structuredData: true });
    return res.status(200).json({
      reportID,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const updateReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
  const { report_id, report, reporter_id } = req.body;
  const reportID = report_id;
  const reporterID = reporter_id;

  const newReport: Report = {
    bankCode: report.bank_code,
    bankAccountNumber: report.bank_account_number,
    name: report.name,
    phoneNumber: report.phone_number,
    nationalIdNumber: report.national_id_number,
    amount: report.amount,
    eventDate: report.event_date,
    eventDetail: report.event_detail,
    reporterId: report.reporter_id,
    paymentMethod: report.payment_method,
    productLink: report.product_link,
    status: report.status,
    document: [],
  };
  try {
    const reportRef = await db.collection(REPORT_COLLECTION).doc(reportID);
    const reportDoc = await reportRef.get();
    let oldReport = {};
    if (reportDoc.exists) {
      oldReport = reportDoc.data() || {};
    }
    await saveHistory(reporterID, ActionType.UPDATE, reportID, oldReport, newReport, db);

    await reportRef.update(newReport);
    functions.logger.info(`Updated report ${report_id} by ${reporterID}`, { structuredData: true });
    return res.status(200).json({
      reportID,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const verify = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
  const { report_id, reporter_id, status } = req.body;
  try {
    const reportRef = await db.collection(REPORT_COLLECTION).doc(report_id);
    const reportDoc = await reportRef.get();
    let oldStatus;
    if (reportDoc.exists) {
      oldStatus = reportDoc.data() || undefined;
    }
    reportRef.update({
      status,
    });
    await saveHistory(reporter_id, ActionType.UPDATE, report_id, oldStatus?.status, status, db);
    return res.status(200).json({
      reportID: report_id,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const getReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'GET') return res.status(403).send('Forbidden!');
  const { q, by } = req.query;
  const searchQuery = getSearchQuery(by as string);

  if (searchQuery === '') return res.status(404).send('Missing search by');

  try {
    const snapshot = await db
      .collection(REPORT_COLLECTION)
      .where(searchQuery, '==', q)
      .where('status', '==', 2)
      .orderBy('created_at', 'desc')
      .get();
    if (snapshot.empty) {
      return res.status(200).send(null);
    }
    const reports: FirebaseFirestore.DocumentData[] = [];
    let totalDamagedPrice = 0;
    snapshot.forEach((s) => {
      const report = s.data();
      totalDamagedPrice += report.amount;
      reports.push(report);
    });
    // console.log(dayjs.unix(reports[0].created_at.seconds).add(7, 'hours').format(DATE_FORMAT));
    console.log({
      name: q,
      totalReport: reports.length,
      totalDamagedPrice,
      lastedReport: reports[0],
    });
    return res.status(200).send({
      name: q,
      totalReport: reports.length,
      totalDamagedPrice,
      lastedReport: reports[0],
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export default {};
