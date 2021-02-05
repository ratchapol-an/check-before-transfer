import { SearchForm } from '@components/Search';
import { Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import clsx from 'clsx';
import './hero.less';

const Hero: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => {
  return (
    <section className={clsx('hero', className)} {...rest}>
      <Space direction="vertical">
        <Title className="hero-title">
          เช็ครายการโกง
          <br />
          ก่อนโอนเงิน
        </Title>
        <SearchForm size="large" />
      </Space>
    </section>
  );
};

export default Hero;
