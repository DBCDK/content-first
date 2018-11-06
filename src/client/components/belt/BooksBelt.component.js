import React from 'react';

import BooksBelt from './templates/BooksBelt.container';
import WorkPreview from '../work/WorkPreview.component';
import SimilarBooksBelt from './templates/SimilarBooksBelt.container';
import InteractionsRecoBelt from './templates/InteractionsRecoBelt.container';

const BeltWrapper = ({belt}) => {
  if (!belt) {
    return null;
  }

  console.log('Belt ???????????????????????', belt);

  if (belt.name === 'Bedste forslag') {
    console.log('Return <InteractionsRecoBelt>');
    return (
      <InteractionsRecoBelt
        key={belt.name}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.type === 'preview') {
    console.log('Return <WorkPreview>');
    return (
      <WorkPreview
        pid={belt.pid}
        onMoreLikeThisClick={() => alert('more like this')}
        scrollToChildBelt={() => () => alert('scroll to childbelt')}
      />
    );
  }
  if (belt.type === 'belt') {
    console.log('Return <BooksBelt>');
    return (
      <BooksBelt
        key={belt.name}
        belt={belt}
        tags={belt.tags}
        childTemplate={BeltWrapper}
      />
    );
  }
  if (belt.pid) {
    console.log('Return <SimilarBooksBelt>');
    return (
      <SimilarBooksBelt
        key={belt.name}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapper}
      />
    );
  }
};
export default BeltWrapper;
