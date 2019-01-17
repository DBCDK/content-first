import React from 'react';
import withScrollToComponent from '../base/scroll/withScrollToComponent.hoc';
import BooksBelt from './templates/BooksBelt.container';
import WorkPreview from '../work/WorkPreview.component';
import PidsToPids from './templates/PidsToPids.container';
import InteractionsToPids from './templates/InteractionsToPids.container';
import TagsToPids from './templates/TagsToPids.container';

const BeltWrapper = ({belt}) => {
  if (!belt) {
    return null;
  }

  if (belt.name === 'Bedste forslag') {
    return (
      <InteractionsToPids
        key={belt.key}
        belt={belt}
        childTemplate={BeltWrapperWithScroll}
      />
    );
  }
  if (belt.onFrontPage) {
    return (
      <TagsToPids
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
      <PidsToPids
        key={belt.key}
        likes={[belt.pid]}
        belt={belt}
        childTemplate={BeltWrapperWithScroll}
      />
    );
  }
  return (
    <TagsToPids
      key={belt.key}
      belt={belt}
      tags={belt.tags}
      childTemplate={BeltWrapperWithScroll}
    />
  );
};
const BeltWrapperWithScroll = withScrollToComponent(BeltWrapper);
export default BeltWrapperWithScroll;
