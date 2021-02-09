/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import cors from 'cors';
import dayjs from 'dayjs';
import { Report, ActionType } from './types';
import { saveHistory } from './services/history';
import { getSearchQuery } from './services/search';
import 'dayjs/locale/th';
// Day.js
dayjs.locale('th');
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
      created_at: admin.firestore.Timestamp.fromDate(dayjs().toDate()),
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

export const getReports = firebaseFunction.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    if (req.method !== 'GET') return res.status(403).send('Forbidden!');
    const { q, by } = req.query;
    const searchQuery = getSearchQuery(by as string);

    if (searchQuery === '') return res.status(404).send('Missing search by');

    try {
      const snapshot = await db
        .collection(REPORT_COLLECTION)
        .where(searchQuery, '==', q)
        .orderBy('created_at', 'desc')
        .get();
      if (snapshot.empty) {
        console.log('No matching report.');
        return;
      }
      const reports: FirebaseFirestore.DocumentData[] = [];
      let totalDamagedPrice = 0;
      snapshot.forEach((s) => {
        const report = s.data();
        totalDamagedPrice += report.amount;
        reports.push(report);
      });

      return res.status(200).send({
        name: q,
        count: reports.length,
        total: totalDamagedPrice,
        last_report: reports[0],
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  });
});

// export default {};
