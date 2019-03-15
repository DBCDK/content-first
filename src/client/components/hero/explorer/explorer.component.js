import React from 'react';

import T from '../../base/T';
import Title from '../../base/Title';
import Icon from '../../base/Icon';

import './explorer.css';

const Explorer = () => {
  return (
    <div className="info-callToAction text-center">
      <Title type="title5" variant="color-white">
        <T component="hero" name="exploreText" renderAsHtml={true} />
      </Title>
      <Icon className="md-xlarge" name="expand_more" />
    </div>
  );
};

export default Explorer;
