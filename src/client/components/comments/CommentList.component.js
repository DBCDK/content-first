import React from 'react';
import Spinner from '../general/Spinner.component';
import timeToString from '../../utils/timeToString';
import CommentUserImage from './CommentUserImage.component';
import CommentInput from './CommentInput.component';

class CommentWrapper extends React.Component {
  state = {
    edit: false,
    comment: this.props.comment.comment
  };

  toggleEdit(value) {
    this.props.toggleEdit({
      comment: this.props.comment,
      editing: value
    });
  }

  editComment = () => {
    this.props.editComment({
      id: this.props.comment._key,
      comment: {
        ...this.props.comment,
        comment: this.state.comment
      }
    });
  };
  render() {
    const {
      comment,
      user,
      _id,
      saving,
      error,
      _created = Date.now() / 1000
    } = this.props.comment;
    return (
      <div key={_id} className="comment-wrapper">
        {saving ? (
          <div className="comment-saving">
            <Spinner size="30px" />
          </div>
        ) : (
          ''
        )}
        {this.props.user.openplatformId === user.openplatformId ? (
          <button
            className="btn btn-link link-subtle"
            onClick={() => this.toggleEdit(!this.props.comment.editing)}
          >
            <span className="glyphicon glyphicon-pencil" />
          </button>
        ) : (
          'not owner'
        )}
        <div className="flex mb2" style={{width: '100%'}}>
          <CommentUserImage user={user} style={{flexShrink: 0}} />
          <div className="ml2" style={{flexGrow: 1}}>
            <div className="comment-author">{user.name || ''}</div>
            <div className="comment-time mb1">{timeToString(_created)}</div>
            {this.props.comment.editing ? (
              <CommentInput
                hideProfile={true}
                autoFocus={true}
                user={this.props.user}
                value={this.state.comment}
                onSubmit={this.editComment}
                onCancel={() => this.toggleEdit(false)}
                onChange={value => this.setState({comment: value})}
                disabled={saving}
                error={error || null}
              />
            ) : (
              <div className="comment">{comment}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
  }
  componentDidUpdate() {
    if (
      this.listWrapper &&
      this.listWrapper.offsetHeight &&
      this.state.height !== this.listWrapper.offsetHeight
    ) {
      this.setState({height: this.listWrapper.offsetHeight});
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
          height: this.state.height + 35,
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
              editComment={this.props.editComment}
            />
          ))}
        </div>
      </div>
    );
  }
}
