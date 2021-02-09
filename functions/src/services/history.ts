/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { ReportHistory, ActionType, Report } from '../types';

const { serverTimestamp } = admin.firestore.FieldValue;
const REPORT_HISTORY_COLLECTION = 'report_histories';

export const saveHistory = async (
  who: string,
  action: ActionType,
  reportID: string,
  oldData: FirebaseFirestore.DocumentData | Report,
  newData: FirebaseFirestore.DocumentData | Report,
  db: FirebaseFirestore.Firestore,
): Promise<void> => {
  const reportHistoryRef = await db.collection(REPORT_HISTORY_COLLECTION).doc(reportID);

  const reportHistoryDoc = await reportHistoryRef.get();

  const newReportHistory: ReportHistory = {
    reporterID: who,
    action,
    changed: {
      old: oldData,
      new: newData,
    },
  };
  if (reportHistoryDoc.exists) {
    const currentHistories = reportHistoryDoc.data()?.history || [];
    await reportHistoryRef
      .update({ history: [...currentHistories, newReportHistory], updated_at: serverTimestamp() })
      .catch((e) => {
        logger.info(`Fail to save history => ${e}`, { structuredData: true });
      });
  } else {
    await reportHistoryRef
      .set({ history: [newReportHistory], updated_at: serverTimestamp() })
      .catch((e) => logger.info(`Fail to save history => ${e}`, { structuredData: true }));
  }
};

export default {};
