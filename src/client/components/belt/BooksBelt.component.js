import React from 'react';

import BooksBelt from './templates/BooksBelt.container';
import WorkPreview from '../work/WorkPreview.component';
import SimilarBooksBelt from './templates/SimilarBooksBelt.container';
import InteractionsRecoBelt from './templates/InteractionsRecoBelt.container';

const BeltWrapper = ({belt}) => {
  if (!belt) {
    return null;
  }

  if (belt.name === 'Bedste forslag') {
    return (
      <InteractionsRecoBelt
        key={belt.key}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.onFrontPage) {
    return (
      <BooksBelt
        key={belt.key}
        belt={belt}
        tags={belt.tags}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.type === 'preview') {
    return (
      <WorkPreview
        key={belt.key}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.type === 'belt') {
    return (
      <SimilarBooksBelt
        key={belt.key}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  return (
    <BooksBelt
      key={belt.key}
      belt={belt}
      tags={belt.tags}
      childTemplate={BeltWrapper}
    />
  );
};
export default BeltWrapper;
