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

  const token = await validateToken(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  const { body } = req.body;

  const reporterID = token.uid;
  const newReport: Report = {
    bankCode: body.bankCode,
    bankAccountNumber: body.bankAccountNumber,
    name: body.name,
    phoneNumber: body.phoneNumber,
    nationalIdNumber: body.nationalIdNumber,
    amount: body.amount,
    eventDate: body.eventDate,
    eventDetail: body.eventDetail,
    reporterId: reporterID,
    paymentMethod: body.paymentMethod,
    productLink: body.productLink,
    productType: body.productType,
    status: 1,
    attachedFiles: body.attachedFiles,
    created_at: firebaseAdmin.firestore.Timestamp.fromDate(dayjs().toDate()),
  };

  try {
    const writeResult = await db.collection(REPORT_COLLECTION).add(newReport);
    const reportId = writeResult.id;
    await saveHistory(reporterID, ActionType.CREATE, reportId, {}, newReport, db);
    functions.logger.info(`Add report ${reportId} by ${reporterID}`, { structuredData: true });
    return res.status(200).json({
      reportId,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const updateReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const token = await validateToken(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  const report: Report = req.body;
  if (!report.id) return res.status(400).send('Invalid reportId');
  const reportId = report.id;
  const reporterId = token.sub;

  const newReport: Report = {
    bankCode: report.bankCode,
    bankAccountNumber: report.bankAccountNumber,
    name: report.name,
    phoneNumber: report.phoneNumber,
    nationalIdNumber: report.nationalIdNumber,
    amount: report.amount,
    eventDate: report.eventDate,
    eventDetail: report.eventDetail,
    paymentMethod: report.paymentMethod,
    productLink: report.productLink,
    status: report.status,
    productType: report.productType,
  };
  try {
    const reportRef = await db.collection(REPORT_COLLECTION).doc(reportId);
    const reportDoc = await reportRef.get();
    let oldReport = {};

    if (reportDoc.exists) oldReport = reportDoc.data() || {};

    await saveHistory(reporterId, ActionType.UPDATE, reportId, oldReport, newReport, db);

    await reportRef.update(newReport);
    functions.logger.info(`Updated report ${reportId} by ${reporterId}`, { structuredData: true });
    return res.status(204);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const verify = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'PUT') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);

  if (idToken === '') return res.status(401).send('Unauthorized');

  const token = await validateIsAdmin(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  const { report_id, status } = req.body;
  const reporterID = token.sub;

  try {
    const reportRef = await db.collection(REPORT_COLLECTION).doc(report_id);
    const reportDoc = await reportRef.get();
    let oldStatus;

    if (reportDoc.exists) oldStatus = reportDoc.data() || undefined;

    reportRef.update({
      status,
    });
    await saveHistory(reporterID, ActionType.UPDATE, report_id, oldStatus?.status, status, db);
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

    if (snapshot.empty) return res.status(200).send(null);

    const reports: FirebaseFirestore.DocumentData[] = [];
    let totalDamagedPrice = 0;
    snapshot.forEach((s) => {
      const report = s.data();
      totalDamagedPrice += report.amount;
      reports.push(report);
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

export const getReports = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'GET') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const token = await validateToken(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const snapshot = await db
      .collection(REPORT_COLLECTION)
      .where('reporterId', '==', token.uid)
      .orderBy('created_at', 'desc')
      .get();

    if (snapshot.empty)
      return res.status(200).send({
        total: 0,
        data: [],
      });

    const reports: FirebaseFirestore.DocumentData[] = [];
    snapshot.forEach((s) => {
      const report = s.data();
      reports.push({ id: s.id, ...report });
    });
    return res.status(200).send({
      total: snapshot.size,
      data: reports,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const deleteReport = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'DELETE') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const token = await validateToken(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  const { reportID } = req.body;

  try {
    await db.collection(REPORT_COLLECTION).doc(reportID).delete();
    return res.status(200).send({
      reportID,
      status: 'deleted',
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export default {};
