import React from 'react';
import {connect} from 'react-redux';

import {
  FOLLOW,
  UNFOLLOW,
  FOLLOW_LOAD_REQUEST
} from '../../../redux/follow.reducer';

const withFollow = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    fetch() {
      this.props.getFollows();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      isFollowing: state.followReducer[ownProps._id]
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    getFollows: () => dispatch({type: FOLLOW_LOAD_REQUEST}),
    follow: () =>
      dispatch({
        type: FOLLOW,
        id: ownProps._id,
        cat: 'list'
      }),
    unFollow: () => {
      dispatch({
        type: UNFOLLOW,
        id: ownProps._id
      });
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

export default withFollow;
