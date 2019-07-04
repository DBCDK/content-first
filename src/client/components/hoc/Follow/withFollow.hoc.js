import React from 'react';
import {connect} from 'react-redux';

import {
  FOLLOW,
  UNFOLLOW,
  FOLLOW_LOAD_REQUEST,
  FOLLOW_LOAD_RESPONSE,
  FOLLOW_ERROR
} from '../../../redux/follow.reducer';
import {fetchObjects, addObject, deleteObject} from '../../../utils/requester';

const withFollow = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.getFollow();
    }

    /**
     * Check if a specific list is followed
     **/
    async getFollow() {
      const {
        _id,
        isFollowing,
        onRequest,
        onResponse,
        onError,
        openplatformId
      } = this.props;

      // Reducer Request action - FOLLOW_LOAD_REQUEST
      onRequest();

      // If list is already followed (in state) - dont fetch it again.
      if (isFollowing) {
        return;
      }

      // Fetch follow data
      try {
        const follows = (await fetchObjects(_id, 'follows', openplatformId))
          .data;
        // Reducer Response action - FOLLOW_LOAD_RESPONSE
        onResponse(follows);
      } catch (e) {
        onError(e);
      }
    }

    /**
     * Follow
     **/
    follow = async () => {
      try {
        const resp = await addObject({
          id: this.props._id,
          key: this.props._id,
          _type: 'follows',
          cat: 'list',
          _created: Math.round(new Date().getTime() / 1000)
        });
        // Dispatch reducer FOLLOW action
        this.props.onFollow(resp.data._id);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    /**
     * unFollow
     **/
    unFollow = async () => {
      try {
        const _id = this.props.followedList._id;
        await deleteObject({_id});

        // Dispatch reducer FOLLOW action
        this.props.onUnfollow();
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          follow={this.follow}
          unFollow={this.unFollow}
        />
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      followedList: state.followReducer[ownProps._id],
      isFollowing: !!state.followReducer[ownProps._id],
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
    onFollow: _id =>
      dispatch({
        type: FOLLOW,
        id: ownProps._id,
        cat: 'list',
        _id
      }),
    onUnfollow: () =>
      dispatch({
        type: UNFOLLOW,
        id: ownProps._id
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
