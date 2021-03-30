import { Input, Radio, RadioChangeEvent, Space, Typography, message } from 'antd';
import clsx from 'clsx';
import SearchBy from 'models/searchBy';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './SearchForm.less';

const placeHolders: Record<SearchBy, string> = {
  'bank-account': 'ระบุเลขบัญชีธนาคาร เช่น 099-9-99999-0 หรือ 0999999990',
  phone: 'ระบุเบอร์มือถือ เช่น 099-999-9999 หรือ 0999999999',
  'id-number': 'ระบุหมายเลขประจำตัวประชาชน เช่น 190990000999',
  name: 'ระบุชื่อนามสกุล โดยไม่มีคำนำหน้า เช่น สมชาย ใจดี',
};

const helpMsg: Record<SearchBy, string> = {
  'bank-account': 'กรุณาระบุเลขบัญชีอย่างน้อย 10 หลัก',
  phone: 'กรุณาระบุเบอร์โทรศัพท์มือถือ 10 หลัก',
  'id-number': 'กรุณาระบุเลขประจำตัวประชาชน 13 หลัก',
  name: 'กรุณาระบุชื่อนามสกุล โดยไม่มีคำนำหน้า',
};

type SearchFormProps = {
  size?: 'normal' | 'large';
  initialValue?: string;
  initialSearchBy?: SearchBy;
};

const SearchForm: React.FunctionComponent<SearchFormProps> = ({
  size = 'normal',
  initialValue = '',
  initialSearchBy = 'bank-account',
}) => {
  const { Search } = Input;
  const { Text } = Typography;
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [searchBy, setSearchBy] = useState<SearchBy>(initialSearchBy);
  const router = useRouter();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearch = async (value: string) => {
    let isValid = false;
    switch (searchBy) {
      case 'bank-account': {
        if (value?.replace(/-| /g, '').length >= 10) {
          isValid = true;
        }
        break;
      }
      case 'id-number': {
        if (value?.replace(/-| /g, '').length === 13) {
          isValid = true;
        }
        break;
      }
      case 'phone': {
        if (value?.replace(/-| /g, '').length === 10) {
          isValid = true;
        }
        break;
      }
      case 'name': {
        if (value?.replace(/-| {2}/g, '').length >= 3) {
          isValid = true;
        }
        break;
      }
      default:
        break;
    }
    if (isValid) {
      await router.push(`/results?q=${value}&by=${searchBy}`);
    } else {
      message.warning(helpMsg[searchBy]);
    }
  };
  const handleSearchByChange = (e: RadioChangeEvent) => {
    setSearchBy(e.target.value);
  };
  return (
    <Space className={clsx('search-form', { 'search-form-lg': size === 'large' })} direction="vertical" size="middle">
      <Radio.Group onChange={handleSearchByChange} value={searchBy}>
        <Radio value="bank-account">เลขบัญชีธนาคาร</Radio>
        <Radio value="phone">เบอร์โทรศัพท์มือถือ</Radio>
        <Radio value="id-number">เลขประจำตัวประชาชน</Radio>
        <Radio value="name">ชื่อ-นามสกุล</Radio>
      </Radio.Group>
      <Search
        // placeholder={placeHolders[searchBy]}
        allowClear
        enterButton="ค้นหา"
        size="large"
        value={searchValue}
        onChange={handleInputChange}
        onSearch={handleSearch}
        type="search"
        minLength={5}
        maxLength={searchBy === 'name' ? 100 : 20}
      />
      <Text type="secondary">{placeHolders[searchBy]}</Text>
      {/* {helpMsg && <Text type="warning">{helpMsg}</Text>} */}
    </Space>
  );
};

export default SearchForm;
