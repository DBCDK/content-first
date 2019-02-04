import React from 'react';
import BooksBelt from './Base.container';
import withIsVisible from '../../base/scroll/withIsVisible.hoc';
import withPidsToPids from '../../base/Recommender/withPidsToPids.hoc';

export const PidsToPids = props => <BooksBelt {...props} showTags={false} />;

export default withIsVisible(withPidsToPids(PidsToPids));
