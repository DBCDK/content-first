import React from 'react';
import CommentWrapper from './CommentWrapper.component';

export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
  }
  componentDidUpdate() {
    const adjust = this.props.comments.filter(comment => comment.editing).length
      ? 30
      : 0;
    if (
      this.listWrapper &&
      this.listWrapper.offsetHeight &&
      this.state.height !== this.listWrapper.offsetHeight + adjust
    ) {
      this.setState({height: this.listWrapper.offsetHeight + adjust});
    }
  }

  render() {
    const {comments, showCount = 1} = this.props;
    if (!comments || comments.length === 0) {
      return null;
    }

    const showComments = comments.slice(-showCount);
    return (
      <div
        style={{
          overflow: 'hidden',
          height: this.state.height,
          transition: 'height 500ms'
        }}
      >
        <div ref={el => (this.listWrapper = el)}>
          {showComments.map(comment => (
            <CommentWrapper
              toggleEdit={this.props.toggleEdit}
              user={this.props.user}
              key={comment._id}
              comment={comment}
              deleteComment={this.props.deleteComment}
              editComment={this.props.editComment}
            />
          ))}
        </div>
      </div>
    );
  }
}
