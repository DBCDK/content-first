import React from 'react';
import {connect} from 'react-redux';

import {
  FOLLOW_LOAD_REQUEST,
  FOLLOW_LOAD_RESPONSE,
  FOLLOW_ERROR
} from '../../../redux/follow.reducer';
import {fetchObjects} from '../../../utils/requester';
import {createGetFollowedLists} from '../../../redux/selectors';

const getFollowedLists = createGetFollowedLists();

const withFollow = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
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
        openplatformId
      } = this.props;

      if (followState.loaded) {
        return;
      }

      // Reducer Request action - FOLLOW_LOAD_REQUEST
      onRequest();
      // Fetch follow data
      try {
        const follows = (await fetchObjects(null, 'follows', openplatformId))
          .data;
        // Reducer Response action - FOLLOW_LOAD_RESPONSE
        onResponse(follows);
      } catch (e) {
        onError(e);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      followedLists: getFollowedLists(state),
      followState: state.followReducer,
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequest: () => dispatch({type: FOLLOW_LOAD_REQUEST}),
    onResponse: data =>
      dispatch({
        type: FOLLOW_LOAD_RESPONSE,
        data
      }),
    onError: data =>
      dispatch({
        type: FOLLOW_ERROR,
        data
      })
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

export default withFollow;
