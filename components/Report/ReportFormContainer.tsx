import { ExclamationCircleOutlined } from '@ant-design/icons';
import Report, { UploadedFile } from '@models/Report';
import ReportStatus from '@models/ReportStatus';
import { Modal, ModalFuncProps } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useCallback } from 'react';
import { deleteFile } from 'services/reportingService';
import ReportForm, { ReportFormValues } from './ReportForm';

type Props = {
  initialReport?: ReportFormValues;
  token: string;
  submitBtnText: string;
  viewOnly?: boolean;
  isReviewing?: boolean;
  onConfirm: (report: Report) => Promise<any>;
  onStatusChange?: (reportId: string, status: ReportStatus) => Promise<void>;
};
const ReportFormContainer: React.FunctionComponent<Props> = ({
  initialReport,
  token,
  onConfirm,
  onStatusChange,
  submitBtnText,
  viewOnly,
  isReviewing,
}) => {
  const handleFormFinish = useCallback(
    async (formValues: ReportFormValues) => {
      console.log(formValues);
      const { confirm } = Modal;

      confirm({
        title: 'รู้ก่อนส่ง',
        icon: <ExclamationCircleOutlined />,
        content:
          'ประมวลกฎหมายอาญา กำหนดความผิดฐานหมิ่นประมาทไว้ใน มาตรา 326 โดยมีมาตรา 328 เป็นบทเพิ่มโทษบัญญัติไว้ว่า "มาตรา 326 ผู้ใดใส่ความผู้อื่นต่อบุคคลที่สาม โดยประการที่น่าจะทำให้ผู้อื่นนั้นเสียชื่อเสียง ถูกดูหมิ่น หรือถูกเกลียดชัง ผู้นั้นกระทำความผิดฐานหมิ่นประมาท ต้องระวางโทษจำคุกไม่เกินหนึ่งปี หรือปรับไม่เกินสองหมื่นบาท หรือทั้งจำทั้งปรับ"',
        async onOk() {
          const { eventDate, ...restFormValues } = formValues;
          const uploadedFiles = restFormValues.attachedFiles
            .filter((f) => !!f.response && f.status !== 'uploading')
            .map((f) => f.response) as UploadedFile[];
          const newReport: Report = {
            ...restFormValues,
            id: initialReport?.id || '0',
            eventDate: eventDate.toISOString(),
            attachedFiles: {
              files: uploadedFiles,
            },
          };
          await onConfirm(newReport);
        },
        onCancel() {},
        okText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
      });
    },
    [initialReport?.id, onConfirm],
  );

  const handleRemoveUploadFile = useCallback(
    async (file: UploadFile<any>, reportSession: string): Promise<boolean> => {
      await deleteFile(reportSession, file.name, token);
      return true;
    },
    [token],
  );
  const handleStatusChange = useCallback(
    async (status: ReportStatus) => {
      if (!initialReport || !onStatusChange) {
        return;
      }
      const { confirm } = Modal;
      const confirmModalProps: ModalFuncProps = {
        async onOk() {
          await onStatusChange(initialReport.id, status);
        },
        onCancel() {},
        okText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
        icon: <ExclamationCircleOutlined />,
      };
      switch (status) {
        case ReportStatus.Rejected: {
          confirm({ title: 'ยืนยันที่จะปฏิเสธรายงานนี้', ...confirmModalProps });
          break;
        }
        case ReportStatus.Approved: {
          confirm({ title: 'ยืนยันที่จะอนุมัติรายงานนี้', ...confirmModalProps });
          break;
        }
        case ReportStatus.RequestMoreDocument: {
          confirm({ title: 'ยืนยันที่จะขอเอกสารเพิ่มเติมสำหรับรายงานนี้', ...confirmModalProps });
          break;
        }
        default:
      }
    },
    [initialReport, onStatusChange],
  );
  return (
    <ReportForm
      viewOnly={viewOnly}
      submitBtnText={submitBtnText}
      initialReport={initialReport}
      isReviewing={isReviewing}
      onFinish={handleFormFinish}
      onRemoveUploadedFile={handleRemoveUploadFile}
      onUpdateStatus={handleStatusChange}
    />
  );
};

export default ReportFormContainer;
