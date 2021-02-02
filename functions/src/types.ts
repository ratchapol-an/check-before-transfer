/* eslint-disable no-unused-vars */
export interface ReportReq {
  transferType: string;
  transferDetail: string;
  bank: string;
  accountNumber: string;
  phoneNumber: string;
  passportID: string;
  amount: number;
  effectedDate: string;
  doucument: string[];
  reportSource: string;
  reportDetail: string;
  reporterID?: string;
}

export interface ReportHistory {
  action: string;
  changed: ChangedOBJ;
  reporterID: string;
}
interface ChangedOBJ {
  old: string | undefined | Record<string, unknown>;
  new: string | undefined | Record<string, unknown> | ReportReq;
}

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
}
