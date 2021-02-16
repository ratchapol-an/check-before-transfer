import { Typography, Form, Input, Button, Space } from 'antd';

import Image from 'next/image';

const SignUpForm: React.FunctionComponent = () => {
  const { Title } = Typography;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  return (
    <div className="sign-up-form">
      <Image width={197.15} height={45} alt="whoscheat" src="/logo3.png" />
      <Title level={3}>สร้างบัญชีของคุณ</Title>
      <Form form={form} name="signUpForm" onFinish={onFinish} scrollToFirstError layout="vertical" autoComplete="off">
        <Form.Item
          name="email"
          label="อีเมล์"
          rules={[
            {
              type: 'email',
              message: 'อีเมล์ไม่ถูกต้อง',
            },
            {
              required: true,
              message: 'โปรดใส่อีเมล์เพื่อใช้สร้างบัญชีของคุณ',
            },
          ]}
        >
          <Input type="email" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[
            {
              required: true,
              message: 'โปรดใส่รหัสผ่าน',
            },
          ]}
          hasFeedback
        >
          <Input.Password autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="ยืนยันรหัสผ่าน"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'โปรดใส่รหัสผ่านอีกครั้งเพื่อป้องกันความผิดพลาด',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('รหัสผ่านทั้งสองช่องไม่เหมือนกัน'));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            ลงทะเบียน
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpForm;
