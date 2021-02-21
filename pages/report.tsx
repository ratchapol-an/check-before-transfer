import Head from 'next/head';
import { Card, Divider, Layout, Typography, Modal } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportForm, ReportFormValues } from '@components/Report';
import './index.less';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { addReport } from 'services/reportingService';
import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const ReportPage: React.FunctionComponent = () => {
  const { Content } = Layout;
  const { Title } = Typography;
  const { confirm } = Modal;
  const AuthUser = useAuthUser();
  const router = useRouter();
  const handleFormFinish = async (values: ReportFormValues) => {
    confirm({
      title: 'รู้ก่อนส่ง',
      icon: <ExclamationCircleOutlined />,
      content:
        'ประมวลกฎหมายอาญา กำหนดความผิดฐานหมิ่นประมาทไว้ใน มาตรา 326 โดยมีมาตรา 328 เป็นบทเพิ่มโทษบัญญัติไว้ว่า "มาตรา 326 ผู้ใดใส่ความผู้อื่นต่อบุคคลที่สาม โดยประการที่น่าจะทำให้ผู้อื่นนั้นเสียชื่อเสียง ถูกดูหมิ่น หรือถูกเกลียดชัง ผู้นั้นกระทำความผิดฐานหมิ่นประมาท ต้องระวางโทษจำคุกไม่เกินหนึ่งปี หรือปรับไม่เกินสองหมื่นบาท หรือทั้งจำทั้งปรับ"',
      async onOk() {
        const { uploadFiles, ...report } = values;
        await addReport(report);
        router.push('/thankyou');
      },
      onCancel() {},
      okText: 'ยืนยันรายงาน',
      cancelText: 'ยกเลิก',
    });
  };
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="report-page-layout layout-with-bg">
        <Header auth={AuthUser} />
        <Content>
          <Divider />
          <Container>
            <Title level={3}>รายงานการโกง</Title>
            <Card>
              <ReportForm onFinish={handleFormFinish} />
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  console.log('token', token);

  return {
    props: {},
  };
});

export default withAuthUser()(ReportPage);
