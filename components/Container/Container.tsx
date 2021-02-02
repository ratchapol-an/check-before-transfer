import clsx from 'clsx';
import './container.less';

const Container: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={clsx('container', className)} {...rest}>
    {children}
  </div>
);

export default Container;
