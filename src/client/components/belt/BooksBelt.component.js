import React from 'react';

import BooksBelt from './templates/BooksBelt.container';
import SimilarBooksBelt from './templates/SimilarBooksBelt.container';
import InteractionsRecoBelt from './templates/InteractionsRecoBelt.container';

const BeltWrapper = ({belt}) => {
  if (!belt) {
    return null;
  }

  if (belt.name === 'Bedste forslag') {
    return (
      <InteractionsRecoBelt
        key={belt.name}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.pid) {
    return (
      <SimilarBooksBelt
        key={belt.name}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  return (
    <BooksBelt
      key={belt.name}
      belt={belt}
      tags={belt.tags}
      childTemplate={BeltWrapper}
    />
  );
};
export default BeltWrapper;
