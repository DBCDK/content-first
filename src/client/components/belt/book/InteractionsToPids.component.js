import React from 'react';
import BooksBelt from './Base.container';
import withInteractionsToPids from '../../base/Recommender/withInteractionsToPids.hoc';
import withIsVisible from '../../base/scroll/withIsVisible.hoc';
import withUser from '../../base/User/withUser.hoc';

export const InteractionsToPids = props => {
  const {user} = props;
  const {name, isLoggedIn} = user;
  if (!isLoggedIn) {
    return null;
  }
  const fullName = name ? 'Bedste forslag til ' + name : '';
  return <BooksBelt {...props} showTags={false} name={fullName} />;
};

export default withUser(
  withIsVisible(withInteractionsToPids(InteractionsToPids))
);
