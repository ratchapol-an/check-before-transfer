/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import cors from 'cors';
import { ReportReq, ActionType } from './types';
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
    const reporterID = req.body.reporter_id;
    const newReport: ReportReq = {
      transferType: req.body.transfer_type,
      transferDetail: req.body.transfer_detail,
      bank: req.body.bank,
      accountNumber: req.body.account_number,
      phoneNumber: req.body.phone_number,
      passportID: req.body.passport_id,
      amount: parseFloat(req.body.amount),
      effectedDate: req.body.effected_date,
      doucument: req.body.doucument || [],
      reportSource: req.body.report_source,
      reportDetail: req.body.report_detail,
      reporterID: req.body.reporter_id,
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

    const newReport: ReportReq = {
      transferType: report.transfer_type,
      transferDetail: report.transfer_detail,
      bank: report.bank,
      accountNumber: report.account_number,
      phoneNumber: report.phone_number,
      passportID: report.passport_id,
      amount: parseFloat(report.amount),
      effectedDate: report.effected_date,
      doucument: report.doucument || [],
      reportSource: report.report_source,
      reportDetail: report.report_detail,
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
