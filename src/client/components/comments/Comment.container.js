import React from 'react';
import {connect} from 'react-redux';
import {ADD_COMMENT, FETCH_COMMENTS} from '../../redux/comment.reducer';
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
    this.props.addComment(this.props.id, comment);
    this.setState({showCount: ++this.state.showCount, newCommentValue: ''});
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.comments.error &&
      this.props.comments.error !== nextProps.comments.error
    ) {
      this.setState({
        showCount: this.state.showCount - 1,
        newCommentValue: nextProps.comments.error.comment
      });
    }
  }
  render() {
    return (
      <div className="comments">
        <CommentList
          comments={this.props.comments.comments}
          showCount={
            this.state.showAll
              ? this.props.comments.comments.length
              : this.state.showCount
          }
        />
        <button
          id="comment-toggle"
          onClick={() => this.setState({showAll: !this.state.showAll})}
          style={{marginLeft: 55, position: 'relative', paddingLeft: 0}}
          className="btn btn-link mt1 mb1 link-subtle"
        >
          <CommentsIcon
            value={
              this.props.comments.comments
                ? this.props.comments.comments.length
                : ''
            }
          />
          <span className="ml1">
            {!this.state.showAll
              ? 'Vis alle kommentarer'
              : 'Vis færre kommentarer'}
          </span>
        </button>
        <CommentInput
          user={this.props.user}
          value={this.state.newCommentValue}
          onSubmit={this.onSubmit}
          onChange={value => this.setState({newCommentValue: value})}
          disabled={this.props.comments.saving}
          error={this.props.comments.error || null}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  comments: Object.assign({loading: true}, state.commentReducer[ownProps.id])
});

export const mapDispatchToProps = dispatch => ({
  addComment: (id, comment) => dispatch({type: ADD_COMMENT, comment, id}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer);
