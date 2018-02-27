import React from 'react';
import {connect} from 'react-redux';
import {
  ADD_COMMENT,
  FETCH_COMMENTS,
  getCommentsForId
} from '../../redux/comment.reducer';
import {Comments as CommentsIcon} from '../general/Icons';
import CommentList from './CommentList.component';
import CommentInput from './CommentInput.component';

export class CommentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCount: 1,
      showAll: false,
      newCommentValue: ''
    };
  }
  componentWillMount() {
    this.props.fetchComments(this.props.id);
  }
  onSubmit = comment => {
    this.props.addComment({
      id: this.props.id,
      comment,
      owner: this.props.user.openplatformId
    });
    this.setState({showCount: ++this.state.showCount, newCommentValue: ''});
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && this.props.error !== nextProps.error) {
      this.setState({
        showCount: this.state.showCount - 1,
        newCommentValue: nextProps.error.comment
      });
    }
  }
  render() {
    const commentsCount =
      (this.props.comments && this.props.comments.length) || 0;
    return (
      <div className="comments">
        {commentsCount ? (
          <div className="mb3">
            <CommentList
              comments={this.props.comments}
              showCount={
                this.state.showAll
                  ? this.props.comments.length
                  : this.state.showCount
              }
            />
            {commentsCount > this.state.showCount ? (
              <button
                id="comment-toggle"
                onClick={() => this.setState({showAll: !this.state.showAll})}
                style={{marginLeft: 55, position: 'relative', paddingLeft: 0}}
                className="btn btn-link mt1 mb1 link-subtle"
              >
                <CommentsIcon
                  value={this.props.comments ? this.props.comments.length : ''}
                />
                <span className="ml1">
                  {!this.state.showAll
                    ? 'Vis alle kommentarer'
                    : 'Vis færre kommentarer'}
                </span>
              </button>
            ) : (
              ''
            )}
          </div>
        ) : null}
        <CommentInput
          user={this.props.user}
          value={this.state.newCommentValue}
          onSubmit={this.onSubmit}
          onChange={value => this.setState({newCommentValue: value})}
          disabled={this.props.saving}
          error={this.props.error || null}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  ...getCommentsForId(state, ownProps.id)
});

export const mapDispatchToProps = dispatch => ({
  addComment: ({id, comment, owner}) =>
    dispatch({type: ADD_COMMENT, comment, id, owner}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer);
