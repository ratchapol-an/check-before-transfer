import { Input } from 'antd';
import React, { forwardRef } from 'react';
import ReactInputMask, { Props } from 'react-input-mask';

const InputMask: React.FC<Props> = forwardRef((props, ref) => {
  return (
    <ReactInputMask {...props}>
      {(inputProps: any) => (
        <Input {...inputProps} ref={ref} readOnly={props.readOnly} disabled={props.disabled ? props.disabled : null} />
      )}
    </ReactInputMask>
  );
});

export default InputMask;
