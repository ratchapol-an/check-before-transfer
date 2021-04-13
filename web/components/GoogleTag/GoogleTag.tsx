import { Space } from 'antd';
import './GoogleTag.less';

const GoogleTag: React.FunctionComponent<React.HTMLAttributes<HTMLIFrameElement>> = ({ className, ...rest }) => {
  return (
    
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WR83PLJ"
height="0" width="0" id="googleTagIFrame"></iframe></noscript>

  );
};

export default GoogleTag;
