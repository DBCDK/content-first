import React from 'react';
import {connect} from 'react-redux';
import {
  UPDATE_COMMENT,
  TOGGLE_EDIT_COMMENT,
  DELETE_COMMENT
} from '../../redux/comment.reducer';

import Spinner from '../general/Spinner.component';
import timeToString from '../../utils/timeToString';
import ProfileImage from '../general/ProfileImage.component';
import CommentInput from './CommentInput.component';
import textParser from '../../utils/textParser';

export class CommentWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      comment: this.props.comment.comment
    };
  }

  toggleEdit = value => {
    if (this.props.onChange) {
      this.props.onChange();
    }
    this.setState({editing: value});
  };

  editComment = () => {
    this.props.editComment({
      ...this.props.comment,
      comment: this.state.comment
    });
    this.toggleEdit(false);
  };

  onChange = value => {
    this.setState({comment: value});
    if (this.props.onChange) {
      this.props.onChange();
    }
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
        {this.props.user &&
        this.props.user.openplatformId === user.openplatformId ? (
          <button
            className="comment-edit-button btn btn-link link-subtle"
            onClick={() => this.toggleEdit(!this.state.editing)}
          >
            <span className="glyphicon glyphicon-pencil" />
          </button>
        ) : null}
        <div className="flex mb2" style={{width: '100%'}}>
          <ProfileImage
            user={user}
            style={{flexShrink: 0}}
            style={{marginRight: '20px'}}
          />
          <div style={{flexGrow: 1}}>
            <div className="comment-author">{user.name || ''}</div>
            <div className="comment-time mb1">{timeToString(_created)}</div>
            {this.state.editing ? (
              <CommentInput
                hideProfile={true}
                autoFocus={true}
                user={this.props.user}
                value={this.state.comment}
                onSubmit={this.editComment}
                onCancel={() => this.toggleEdit(false)}
                onDelete={() => this.props.deleteComment(this.props.comment)}
                onChange={this.onChange}
                disabled={saving}
                error={error || null}
              />
            ) : (
              <div
                className="comment"
                dangerouslySetInnerHTML={{__html: textParser(comment)}}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer
});

export const mapDispatchToProps = dispatch => ({
  editComment: comment => dispatch({type: UPDATE_COMMENT, comment}),
  deleteComment: comment => dispatch({type: DELETE_COMMENT, comment}),
  toggleEdit: ({comment, editing}) =>
    dispatch({type: TOGGLE_EDIT_COMMENT, comment, editing})
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentWrapper);
