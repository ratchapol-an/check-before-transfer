import { Form, Select, Input, InputNumber, Button, DatePicker } from 'antd';
import PaymentMethod, { paymentMethodCaptions } from 'models/PaymentMethod';
import { useState } from 'react';
import { data } from 'banks-logo';
import moment from 'moment';
import PicturesWall from '@components/PicturesWall';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { BasedReport } from '@models/Report';
import productTypeCaptions from '@models/productTypeCaptions';
import { deleteFile } from '../../services/reportingService';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
  },
};

const normFile = (e: UploadChangeParam) => e && e.fileList;

const bankOptions = (Object.keys(data) as Array<keyof typeof data>).map((key) => {
  const bank = data[key];
  return (
    <Option value={bank.code} key={bank.code}>
      {bank.official_name_thai}
    </Option>
  );
});

type ReportFormProps = {
  onFinish: (values: ReportFormValues) => void;
  userToken?: string;
};

const ReportForm: React.FunctionComponent<ReportFormProps> = ({ onFinish, userToken }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const handlePaymentMethodSelect = (value: PaymentMethod) => {
    setPaymentMethod(value);
  };

  const handleOnRemove = async (file: UploadFile<any>, reportSession: string): Promise<boolean> => {
    if (!userToken) return false;
    await deleteFile(reportSession, file.name, userToken);
    return true;
  };

  return (
    <Form name="report" {...formItemLayout} onFinish={onFinish}>
      <Form.Item
        name="paymentMethod"
        label="ช่องทางการชำระเงิน"
        hasFeedback
        rules={[{ required: true, message: 'กรุณาเลือกช่องทางการชำระเงิน' }]}
      >
        <Select placeholder="เลือกช่องทางการชำระเงิน" value={paymentMethod} onSelect={handlePaymentMethodSelect}>
          <Option value={PaymentMethod.BankAccountTransfer}>
            {paymentMethodCaptions[PaymentMethod.BankAccountTransfer]}
          </Option>
          <Option value={PaymentMethod.PromptPay}>{paymentMethodCaptions[PaymentMethod.PromptPay]}</Option>
          <Option value={PaymentMethod.TrueWallet}>{paymentMethodCaptions[PaymentMethod.TrueWallet]}</Option>
          <Option value={PaymentMethod.Others}>{paymentMethodCaptions[PaymentMethod.Others]}</Option>
        </Select>
      </Form.Item>
      {paymentMethod === PaymentMethod.BankAccountTransfer && (
        <>
          <Form.Item
            name="bankCode"
            label="ธนาคาร"
            rules={[{ required: true, message: 'กรุณาเลือกธนาคาร' }]}
            hasFeedback
          >
            <Select placeholder="เลือกธนาคาร">{bankOptions}</Select>
          </Form.Item>
          <Form.Item
            name="bankAccountNo"
            label="เลขบัญชีธนาคาร"
            hasFeedback
            rules={[
              { required: true, message: 'กรุณากรอกเลขบัญชีธนาคาร' },
              { pattern: /^[\d-]*\d[\d-]*$/, message: 'เลขบัญชีธนาคารไม่ถูกต้อง' },
            ]}
          >
            <Input type="tel" maxLength={20} />
          </Form.Item>
        </>
      )}
      <Form.Item
        name="phoneNumber"
        label="เบอร์โทรศัพท์มือถือ"
        hasFeedback
        dependencies={['idNumber']}
        required={paymentMethod === PaymentMethod.PromptPay}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (paymentMethod === PaymentMethod.PromptPay && !value && !getFieldValue('idNumber')) {
                return Promise.reject('กรุณากรอกเบอร์โทรศัพท์มือถือ หรือ เลขประจำตัวประชาชน');
              }
              return Promise.resolve();
            },
          }),
          { pattern: /^[\d-]*\d[\d-]*$/, message: 'เบอร์โทรศัพท์มือถือไม่ถูกต้อง' },
        ]}
      >
        <Input type="tel" maxLength={13} />
      </Form.Item>
      <Form.Item
        name="idNumber"
        label="เลขประจำตัวประชาชน"
        hasFeedback
        dependencies={['phoneNumber']}
        required={paymentMethod === PaymentMethod.PromptPay}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (paymentMethod === PaymentMethod.PromptPay && !value && !getFieldValue('phoneNumber')) {
                return Promise.reject('กรุณากรอกเลขประจำตัวประชาชน หรือ เบอร์โทรศัพท์มือถือ');
              }
              return Promise.resolve();
            },
          }),
          { pattern: /^[\d-]*\d[\d-]*$/, message: 'เลขประจำตัวประชาชนไม่ถูกต้อง' },
        ]}
      >
        <Input type="tel" maxLength={17} />
      </Form.Item>
      <Form.Item
        name="amount"
        label="ยอดเงินที่โดนโกง (บาท)"
        rules={[{ required: true, message: 'กรุณากรอกยอดเงินที่โดนโกง' }]}
        hasFeedback
        wrapperCol={{
          xs: { span: 6 },
        }}
      >
        <InputNumber
          precision={2}
          min={0}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => (value ? value.replace(/(,*)/g, '') : '')}
        />
      </Form.Item>
      <Form.Item
        name="eventDate"
        label="วันที่ทำธุรกรรม"
        rules={[{ type: 'object' as const, required: true, message: 'กรุณากรอกวันที่ทำธุรกรรม' }]}
        hasFeedback
        wrapperCol={{
          xs: { span: 8 },
          md: { span: 6 },
          lg: { span: 4 },
        }}
      >
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          showToday
          disabledDate={(currentDate) => currentDate > moment()}
          placeholder="วัน/เดือน/ปี"
        />
      </Form.Item>
      <Form.Item
        name="productType"
        label="ประเภทสินค้าหรือบริการ"
        hasFeedback
        rules={[{ required: true, message: 'กรุณาเลือกประเภทสินค้าหรือบริการ' }]}
      >
        <Select placeholder="เลือกประเภทสินค้าหรือบริการ">
          <Option value={1}>{productTypeCaptions[1]}</Option>
          <Option value={2}>{productTypeCaptions[2]}</Option>
          <Option value={3}>{productTypeCaptions[3]}</Option>
          <Option value={4}>{productTypeCaptions[4]}</Option>
          <Option value={5}>{productTypeCaptions[5]}</Option>
          <Option value={6}>{productTypeCaptions[6]}</Option>
          <Option value={7}>{productTypeCaptions[7]}</Option>
          <Option value={0}>{productTypeCaptions[0]}</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="productLink"
        label="พบสินค้าหรือบริการผ่านทาง"
        rules={[{ required: true, message: 'กรุณากรอกที่มาของสินค้าหรือบริการ' }]}
        hasFeedback
      >
        <Input type="url" placeholder="ลิงค์ไปยังสินค้าหรือบริการ เช่น http://www.cheatshop.com/example/1234" />
      </Form.Item>
      <Form.Item
        name="eventDetail"
        label="รายละเอียดเหตุการณ์"
        rules={[{ required: true, message: 'กรุณากรอกรายละเอียดของเหตุการณ์' }]}
        hasFeedback
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="หลักฐานประกอบ" required>
        <Form.Item
          name="attachedFiles"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
          rules={[
            () => ({
              validator(_, value: UploadFile[]) {
                if (!value || value.filter((o) => o.status === 'done' || o.status === 'success').length <= 0) {
                  return Promise.reject('กรุณาอัพโหลดหลักฐานประกอบ');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <PicturesWall uploadBtnVisible onRemove={handleOnRemove} />
        </Form.Item>
      </Form.Item>
      <Form.Item wrapperCol={{ md: { span: 12, offset: 8 } }}>
        <Button type="primary" htmlType="submit" size="large">
          ส่งรายงาน
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReportForm;

export type ReportFormValues = BasedReport & { attachedFiles: UploadFile[] };
