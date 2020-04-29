import React from 'react';
import {connect} from 'react-redux';

import {
  FOLLOWS_LOAD_REQUEST,
  FOLLOWS_LOAD_RESPONSE,
  FOLLOW_ERROR
} from '../../../redux/follow.reducer';
import {fetchObjects} from '../../../utils/requester';

const withFollow = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.getFollows();
    }
    componentDidUpdate() {
      this.getFollows();
    }

    /**
     * Fetch Follows
     **/
    async getFollows() {
      const {
        followState,
        onRequest,
        onResponse,
        onError,
        openplatformId,
        user
      } = this.props;

      if (followState.loaded || followState.loading || !user.isLoggedIn) {
        return;
      }

      // Reducer Request action - FOLLOW_LOAD_REQUEST
      onRequest();
      // Fetch follow data
      try {
        const follows = (await fetchObjects(null, 'follows', openplatformId))
          .data;
        onResponse(follows);
      } catch (e) {
        onError(e);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => {
    // Followed Lists as an array
    const followedLists = Object.values(state.followReducer).filter(
      follow => follow.cat === 'list'
    );

    return {
      user: state.userReducer,
      followedLists,
      followState: state.followReducer,
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = dispatch => ({
    onRequest: () => dispatch({type: FOLLOWS_LOAD_REQUEST}),
    onResponse: data =>
      dispatch({
        type: FOLLOWS_LOAD_RESPONSE,
        data
      }),
    onError: data =>
      dispatch({
        type: FOLLOW_ERROR,
        data
      })
  });

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
};

export default withFollow;
