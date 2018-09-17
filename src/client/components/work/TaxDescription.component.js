import React from 'react';

const TaxDescription = ({text}) => {
  if (!text) {
    return '';
  }

  return text.split('\n').map((line, i) => {
    return (
      <span key={i}>
        {line}
        <br />
      </span>
    );
  });
};

export default TaxDescription;
