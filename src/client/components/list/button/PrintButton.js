import React from 'react';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import T from '../../base/T';

const PrintButton = ({style, className, _id = 'huskeliste'}) => {
  console.log('in PrintButton');

  return (
    <Button
      size="large"
      type="link2"
      iconLeft="print"
      className={'pr-0 ' + className}
      href={'/print/' + _id}
      style={{backgroundColor: 'unset', marginLeft: '10px', ...style}}
    >
      <T component="list" name="printList" />
    </Button>
  );
};

export default PrintButton;
