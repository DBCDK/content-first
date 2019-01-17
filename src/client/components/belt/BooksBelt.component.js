import React from 'react';
import withScrollToComponent from '../base/scroll/scrollToComponent.hoc';
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
        childTemplate={BeltWrapperWithScroll}
      />
    );
  }
  if (belt.onFrontPage) {
    return (
      <BooksBelt
        key={belt.key}
        belt={belt}
        tags={belt.tags}
        childTemplate={BeltWrapperWithScroll}
      />
    );
  }
  if (belt.type === 'preview') {
    return (
      <WorkPreview
        key={belt.key}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapperWithScroll}
        dataCy={'workpreviewCard'}
      />
    );
  }
  if (belt.type === 'belt') {
    return (
      <SimilarBooksBelt
        key={belt.key}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltWrapperWithScroll}
      />
    );
  }
  return (
    <BooksBelt
      key={belt.key}
      belt={belt}
      tags={belt.tags}
      childTemplate={BeltWrapperWithScroll}
    />
  );
};
const BeltWrapperWithScroll = withScrollToComponent(BeltWrapper);
export default BeltWrapperWithScroll;
