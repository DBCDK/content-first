import React from 'react';
import Button from '../base/Button';

export default () => (
  <div className="tl">
    <div className="buttons flex">
      <div>
        <h4>Primary button</h4>
        <Button>Primary button</Button>
      </div>
      <div className="ml2">
        <h4>Secondary button</h4>
        <Button type="secondary">Secondary button</Button>
      </div>
      <div className="ml2">
        <h4>Tertiary button</h4>
        <Button type="tertiary">Tertiary button</Button>
      </div>
      <div className="ml2">
        <h4>small button</h4>
        <Button size="small">Small button</Button>
      </div>
    </div>
  </div>
);
