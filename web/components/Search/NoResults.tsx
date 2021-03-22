import { Result, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

const NoResults = () => {
  const { Paragraph, Text } = Typography;
  const router = useRouter();
  const onClickReportBtn = () => router.push('/report');
  return (
    <Result
      status="success"
      title="ไม่พบรายงานการโกงในระบบ"
      subTitle="คุณสามารถลองค้นหาด้วยวิธีอื่น หรือหากต้องการเพิ่มรายการโกง กรุณาคลิกปุ่มด้านล่าง"
      extra={[
        // <Button type="primary" key="console">
        //   รายงานกางโกง
        // </Button>,
        <Button key="report" onClick={onClickReportBtn}>
          รายงานการโกง
        </Button>,
      ]}
    >
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            รู้ก่อนโอน:
          </Text>
        </Paragraph>
        <Paragraph>
          การที่ไม่พบรายงานจากการค้นหา ไม่ได้หมายความว่าจะปลอดภัยเสมอไป ผู้โอนควรใช้วิจารณญาณทุกครั้ง ก่อนการโอน
        </Paragraph>
        {/* <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet eligible to apply.{' '}
          <a>Apply Unlock &gt;</a>
        </Paragraph> */}
      </div>
    </Result>
  );
};

export default NoResults;
