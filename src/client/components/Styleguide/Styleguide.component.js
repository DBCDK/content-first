import React from 'react';
import Button from '../base/Button';
import Heading from '../base/Heading';

export default () => (
  <div className="tl mt4">
    <div className="buttons flex">
      <div>
        <Button>Primary button</Button>
      </div>
      <div className="ml2">
        <Button type="secondary">Secondary button</Button>
      </div>
      <div className="ml2">
        <Button type="tertiary">Tertiary button</Button>
      </div>
      <div className="ml2">
        <Button type="term" size="medium">
          Term button (Medium)
        </Button>
      </div>
      <div className="ml2">
        <Button size="small">Small button</Button>
      </div>
    </div>
    <div className="headings">
      <Heading tag="h1" type="lead">
        H1 lead
      </Heading>
      <Heading tag="h1" type="section">
        H1 section heading
      </Heading>
    </div>
  </div>
);
