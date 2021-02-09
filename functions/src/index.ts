/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import cors from 'cors';
import { Report, ActionType } from './types';
import { saveHistory } from './services/history';

// Day.js
// const DATE_FORMAT = 'DD-MM-YYY HH:mm';
const REPORT_COLLECTION = 'reports';

admin.initializeApp();
const defaultCors = cors({ origin: true });
const firebaseFunction = functions.region('asia-southeast2');
export const db = admin.firestore();

export const addReport = firebaseFunction.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    if (req.method !== 'POST') return res.status(403).send('Forbidden!');
    const { body } = req;
    const reporterID = body.reporter_id;

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
      status: body.status,
      document: [],
    };

    const writeResult = await db.collection(REPORT_COLLECTION).add(newReport);
    const reportID = writeResult.id;
    await saveHistory(reporterID, ActionType.CREATE, reportID, {}, newReport, db);
    functions.logger.info(`Add report ${reportID} by ${reporterID}`, { structuredData: true });
    return res.send(`Add report ${reportID} by ${reporterID}`);
  });
});

export const updateReport = firebaseFunction.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    if (req.method !== 'PUT') return res.status(403).send('Forbidden!');
    const { report_id, report, reporter_id } = req.body;
    const reportID = report_id;
    const reporterID = reporter_id;

    const newReport: Report = {
      bankCode: report.bankCode,
      bankAccountNumber: report.bankAccountNumber,
      name: report.name,
      phoneNumber: report.phoneNumber,
      nationalIdNumber: report.nationalIdNumber,
      amount: parseFloat(report.amount),
      eventDate: report.eventDate,
      eventDetail: report.eventDetail,
      reporterId: report.reporterId,
      paymentMethod: report.paymentMethod,
      productLink: report.productLink,
      status: report.status,
      document: [],
    };

    const reportRef = await db.collection(REPORT_COLLECTION).doc(reportID);
    const reportDoc = await reportRef.get();
    let oldReport = {};
    if (reportDoc.exists) {
      oldReport = reportDoc.data() || {};
    }
    await saveHistory(reporterID, ActionType.UPDATE, reportID, oldReport, newReport, db);

    await reportRef.update(newReport);
    functions.logger.info(`Updated report ${report_id} by ${reporterID}`, { structuredData: true });
    return res.status(200).send(`Updated report ${report_id} by ${reporterID}`);
  });
});
// export default {};
