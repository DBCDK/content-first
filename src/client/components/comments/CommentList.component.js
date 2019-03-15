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
    this.updateHeight();
  }

  updateHeight = () => {
    // To make sure that height of listwrapper is updated we need to defer the check.  This is done with setTimeout
    setTimeout(() => {
      if (
        this.listWrapper &&
        this.listWrapper.offsetHeight &&
        this.state.height !== this.listWrapper.offsetHeight
      ) {
        this.setState({height: this.listWrapper.offsetHeight});
      }
    }, 10);
  };
  render() {
    const {comments, showCount = 1} = this.props;
    if (!comments || comments.length === 0) {
      return null;
    }

    const showComments = comments.slice(0, showCount);

    return (
      <div
        style={{
          height: this.state.height || 0,
          transition: 'height 300ms ease-in-out',
          overflow: 'hidden'
        }}
      >
        <div ref={el => (this.listWrapper = el)}>
          {showComments.map(comment => (
            <CommentWrapper
              key={comment._id}
              comment={comment}
              onChange={this.updateHeight}
            />
          ))}
        </div>
      </div>
    );
  }
}
