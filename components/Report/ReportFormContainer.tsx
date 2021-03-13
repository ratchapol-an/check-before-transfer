import { ExclamationCircleOutlined } from '@ant-design/icons';
import Report, { UploadedFile } from '@models/Report';
import { Modal } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useCallback } from 'react';
import { deleteFile } from 'services/reportingService';
import ReportForm, { ReportFormValues } from './ReportForm';

type Props = {
  initialReport?: ReportFormValues;
  token: string;
  submitBtnText: string;
  viewOnly?: boolean;
  onConfirm: (report: Report) => Promise<any>;
};
const ReportFormContainer: React.FunctionComponent<Props> = ({
  initialReport,
  token,
  onConfirm,
  submitBtnText,
  viewOnly,
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
  return (
    <ReportForm
      viewOnly={viewOnly}
      submitBtnText={submitBtnText}
      initialReport={initialReport}
      onFinish={handleFormFinish}
      onRemoveUploadedFile={handleRemoveUploadFile}
    />
  );
};

export default ReportFormContainer;
