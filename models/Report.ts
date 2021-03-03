import PaymentMethod from './PaymentMethod';
import ReportStatus from './ReportStatus';

export type BasedReport = {
  id: string;
  amount: number;
  eventDetail: string;
  reporterId: string;
  paymentMethod: PaymentMethod;
  productType: number;
  productLink: string;
  status: ReportStatus;
  bankCode?: string;
  bankAccountNumber?: string;
  name?: string;
  phoneNumber?: string;
  nationalIdNumber?: string;
};

export interface UploadedFile {
  name: string;
  dirName: string;
  size: number;
  accessToken: string;
  url: string;
}

type Report = BasedReport & {
  attachedFiles?: UploadedFile[];
  eventDate: string;
};

export const mockReport: Report = {
  id: '0ikgg3hLqgbHLQucpxsy',
  amount: 5241.63,
  eventDate: new Date('October 13, 2014').toISOString(),
  eventDetail:
    'อินเตอร์แชมเปี้ยนม็อบอุปสงค์ ซูโม่ สเตริโอแอดมิสชันมวลชน ดยุกนายแบบ อาว์มอลล์ นอร์ทมอคคาสหรัฐ เรตติ้งไฮไลท์ซิงสุนทรีย์แกงค์ แซ็กทอร์นาโดแอปเปิลมิลค์วิว เซนเซอร์ลิมิตเยน อพาร์ทเมนต์เทอร์โบ สะกอมแฮนด์ บึ้มเคลื่อนย้ายซาดิสต์ ฟลุตแพนงเชิญช็อปรวมมิตรทาวน์ แทกติค ฮ่องเต้พาสตาเยนซีนเลดี้ คอลัมน์ไฮเอนด์ทัวริสต์นาฏยศาลาติ่มซำ',
  paymentMethod: PaymentMethod.PromptPay,
  productType: 1,
  productLink:
    'https://shopee.co.th/%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87-%E0%B8%A1%E0%B8%B5%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99-%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1-%E0%B8%A1%E0%B8%B5%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%96%E0%B8%B6%E0%B8%87-3-%E0%B8%AA%E0%B8%B5-i.238526691.3856039502',
  reporterId: '',
  status: ReportStatus.Approved,
  phoneNumber: '0945603070',
  name: 'สมชาย ใจดี',
  attachedFiles: [],
};

export default Report;
