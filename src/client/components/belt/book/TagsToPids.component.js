import React from 'react';
import BooksBelt from './Base.container';
import withIsVisible from '../../base/scroll/withIsVisible.hoc';
import withTagsToPids from '../../base/Recommender/withTagsToPids.hoc';

export const TagsToPids = props => <BooksBelt {...props} showTags={true} />;

export default withIsVisible(withTagsToPids(TagsToPids));
