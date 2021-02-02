import { SearchForm } from '@components/Search';
import { Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import clsx from 'clsx';

const Hero: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => {
  return (
    <section className={clsx('hero', className)} {...rest}>
      <Space direction="vertical">
        <Title>
          เช็ครายการโกง
          <br />
          ก่อนโอนเงิน
        </Title>
        <SearchForm />
      </Space>
    </section>
  );
};

export default Hero;
