/* eslint-disable no-unused-vars */
// export interface ReportReq {
//   transferType: string;
//   transferDetail: string;
//   bank: string;
//   accountNumber: string;
//   phoneNumber: string;
//   passportID: string;
//   amount: number;
//   effectedDate: string;
//   doucument: string[];
//   reportSource: string;
//   reportDetail: string;
//   reporterID?: string;
// }

export enum ReportStatus {
  WaitingForReview = 1,
  Approved = 2,
  Rejected = 3,
}

export enum PaymentMethod {
  Others = 0,
  BankAccountTransfer = 1,
  TrueWallet = 2,
  PromptPay = 3,
}

export interface Report {
  bankCode?: string;
  bankAccountNumber?: string;
  name?: string;
  phoneNumber?: string;
  nationalIdNumber?: string;
  amount: number;
  eventDate: string;
  eventDetail: string;
  reporterId: string;
  paymentMethod: PaymentMethod;
  productLink: string;
  status: ReportStatus;
  document: [];
}

export interface ReportHistory {
  action: string;
  changed: ChangedOBJ;
  reporterID: string;
}
interface ChangedOBJ {
  old: string | undefined | Record<string, unknown> | Report;
  new: string | undefined | Record<string, unknown> | Report;
}

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
}
