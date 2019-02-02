import React from 'react';

import WorkPreview from '../work/WorkPreview.component';
import PidsToPids from './book/PidsToPids.component';
import InteractionsToPids from './book/InteractionsToPids.component';
import TagsToPids from './book/TagsToPids.component';

const BeltFacade = ({belt, ...props}) => {
  if (!belt) {
    return null;
  }

  if (belt.name === 'Bedste forslag') {
    return (
      <InteractionsToPids
        {...props}
        key={belt.key}
        belt={belt}
        childTemplate={BeltFacade}
      />
    );
  }
  if (belt.onFrontPage) {
    return (
      <TagsToPids
        {...props}
        key={belt.key}
        belt={belt}
        tags={belt.tags}
        childTemplate={BeltFacade}
      />
    );
  }
  if (belt.type === 'preview') {
    return (
      <WorkPreview
        {...props}
        key={belt.key}
        pid={belt.pid}
        belt={belt}
        childTemplate={BeltFacade}
        dataCy={'workpreviewCard'}
      />
    );
  }
  if (belt.type === 'belt') {
    return (
      <PidsToPids
        {...props}
        key={belt.key}
        likes={[belt.pid]}
        belt={belt}
        childTemplate={BeltFacade}
      />
    );
  }
  return (
    <TagsToPids
      {...props}
      key={belt.key}
      belt={belt}
      tags={belt.tags}
      childTemplate={BeltFacade}
    />
  );
};
export default BeltFacade;
