import React from 'react';

import T from '../../base/T';
import Title from '../../base/Title';
import Icon from '../../base/Icon';

import './explorer.css';

const Explorer = () => {
  return (
    <div className="info-callToAction text-center">
      <Title type="title4" variant="color-white">
        <T component="hero" name="exploreText" />
      </Title>
      <Icon className="md-xlarge" name="expand_more" />
    </div>
  );
};

export default Explorer;
