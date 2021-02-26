import { PresetColorType } from 'antd/lib/_util/colors';

enum ReportStatus {
  WaitingForReview = 1,
  Approved = 2,
  Rejected = 3,
  RequestMoreDocument = 4,
}

export const reportStatusCaptions: Record<ReportStatus, string> = {
  1: 'รอการรีวิว',
  2: 'อนุมัติ',
  3: 'ไม่ผ่านการรีวิว',
  4: 'ขอหลักฐานเพิ่ม',
};

export const reportStatusColors: Record<ReportStatus, PresetColorType> = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'orange',
};

export default ReportStatus;
