import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';

import Text from '../base/Text';
import T from '../base/T';

import {
  FETCH_COMMENTS,
  getCommentsForIdSelector
} from '../../redux/comment.reducer';

export class CommentCounter extends React.Component {
  componentDidMount() {
    this.updateComments();
  }

  updateComments = () => {
    this.props.fetchComments(this.props.id);
  };

  render() {
    const commentsCount = this.props.comments.length;

    return (
      <Text
        type="small"
        variant="weight-semibold"
        style={{lineHeight: '1.5rem', cursor: 'pointer'}}
        onClick={() => {
          scrollToComponent(this.props.commentsListRef, {
            offset: 100,
            duration: 700
          });
        }}
      >
        <T
          component="post"
          name={commentsCount === 1 ? 'commentCount' : 'commentsCount'}
          vars={[commentsCount || '0']}
        />
      </Text>
    );
  }
}

const makeMapStateToProps = () => {
  const getCommentsForId = getCommentsForIdSelector();

  const mapStateToProps = (state, ownProps) => {
    const comments = getCommentsForId(state, {id: ownProps.id});

    return {
      comments: comments.comments,
      isLoading: comments.loading
    };
  };
  return mapStateToProps;
};

export const mapDispatchToProps = dispatch => ({
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(CommentCounter);
