import React from 'react';
import {connect} from 'react-redux';
import {
  UPDATE_COMMENT,
  TOGGLE_EDIT_COMMENT,
  DELETE_COMMENT,
  FETCH_COMMENTS
} from '../../redux/comment.reducer';

import Spinner from '../general/Spinner.component';
import {timestampToLongDate} from '../../utils/dateTimeFormat';
import ProfileImage from '../general/ProfileImage.component';
import CommentInput from './CommentInput.component';
import Text from '../base/Text';
import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';

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

  updateComments = () => {
    if (this.props.fetchComments && this.props.comment._key) {
      this.props.fetchComments(this.props.comment._key);
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
          <ContextMenu className="comment-wrapper-context-menu">
            <ContextMenuAction
              title="Redigér indlæg"
              icon="edit"
              onClick={() => {
                this.toggleEdit(!this.state.editing);
                this.updateComments();
              }}
            />

            <ContextMenuAction
              title="Slet indlæg"
              icon="clear"
              onClick={() => {
                this.props.deleteComment(this.props.comment);
              }}
            />
          </ContextMenu>
        ) : null}
        <div className="d-flex mb2 w-100">
          <ProfileImage
            className="mt-3"
            user={user}
            style={{flexShrink: 0}}
            size="40"
          />
          <div style={{flexGrow: 1}}>
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
              <div className="comment">
                <div className="d-flex flex-column">
                  <Text
                    type="small"
                    variant="color-due"
                    className="d-none d-md-block mb-1"
                  >
                    {timestampToLongDate(_created)}
                  </Text>
                  <Text type="large" className="mb-2 align-top">
                    {user.name || ''}
                  </Text>
                </div>
                {comment}
              </div>
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
    dispatch({type: TOGGLE_EDIT_COMMENT, comment, editing}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentWrapper);
