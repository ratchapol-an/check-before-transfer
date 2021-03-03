/* eslint-disable no-unused-vars */

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

export type BasedReport = {
  bankCode?: string;
  bankAccountNumber?: string;
  name?: string;
  phoneNumber?: string;
  nationalIdNumber?: string;
  amount: number;
  eventDate: string;
  eventDetail: string;
  reporterId?: string;
  paymentMethod: PaymentMethod;
  productType?: number;
  productLink: string;
  status: ReportStatus;
  id?: string;
};

export type Report = BasedReport & {
  attachedFiles?: string[];
  created_at?: FirebaseFirestore.FieldValue;
};

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

// export type SearchBy = 'bank-account' | 'phone' | 'id-number' | 'name';

export enum SearchBy {
  Payment = 'paymentMethod',
  PhoneNumber = 'phoneNumber',
  nationalID = 'nationalIdNumber',
  Name = 'name',
}

export interface UploadedFile {
  name: string;
  dirName: string;
  size: string;
  accessToken: string;
  url: string;
}
