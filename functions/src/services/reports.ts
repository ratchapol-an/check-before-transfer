/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from 'firebase-functions';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { firebaseAdmin, db } from './firebase';
import { saveHistory } from './history';
import { getSearchQuery } from './search';
import { Report, ActionType } from '../types';
import { getAuthorizationToken, validateIsAdmin, validateToken } from './admin';

const REPORT_COLLECTION = 'reports';

export const addReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'POST') return res.status(403).send('Forbidden!');
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const isValid = await validateToken(idToken);
  if (!isValid) return res.status(401).send('Unauthorized');

  const { body } = req;
  const reporterID = body.reporterId;
  const newReport: Report = {
    bankCode: body.bankCode,
    bankAccountNumber: body.bankAccountNumber,
    name: body.name,
    phoneNumber: body.phoneNumber,
    nationalIdNumber: body.nationalIdNumber,
    amount: body.amount,
    eventDate: body.eventDate,
    eventDetail: body.eventDetail,
    reporterId: body.reporterId,
    paymentMethod: body.paymentMethod,
    productLink: body.productLink,
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
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const isValid = await validateToken(idToken);
  if (!isValid) return res.status(401).send('Unauthorized');

  const { report_id, report, reporter_id } = req.body;
  const reportID = report_id;
  const reporterID = reporter_id;

  const newReport: Report = {
    bankCode: report.bankCode,
    bankAccountNumber: report.bankAccountNumber,
    name: report.name,
    phoneNumber: report.phoneNumber,
    nationalIdNumber: report.nationalIdNumber,
    amount: report.amount,
    eventDate: report.eventDate,
    eventDetail: report.eventDetail,
    reporterId: report.reporterId,
    paymentMethod: report.paymentMethod,
    productLink: report.productLink,
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

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const isAdmin = await validateIsAdmin(idToken);
  if (!isAdmin) return res.status(401).send('Unauthorized');

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
