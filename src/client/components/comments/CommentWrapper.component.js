import React from 'react';
import {connect} from 'react-redux';
import {
  UPDATE_COMMENT,
  TOGGLE_EDIT_COMMENT,
  DELETE_COMMENT,
  FETCH_COMMENTS
} from '../../redux/comment.reducer';

import Spinner from '../general/Spinner/Spinner.component';
import {timestampToLongDate} from '../../utils/dateTimeFormat';
import ProfileImage from '../general/ProfileImage.component';
import CommentInput from './CommentInput.component';
import Text from '../base/Text';
import T from '../base/T';
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
    const isSmallScreen = window.innerWidth < 768;

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
          this.props.user.openplatformId === user.openplatformId &&
          (!isSmallScreen || !this.state.editing) && (
            <ContextMenu className="comment-wrapper-context-menu">
              <ContextMenuAction
                title={T({component: 'post', name: 'editComment'})} //
                icon="edit"
                onClick={() => {
                  this.toggleEdit(!this.state.editing);
                  this.updateComments();
                }}
              />
              <ContextMenuAction
                title={T({component: 'post', name: 'deleteComment'})}
                icon="delete"
                onClick={() => {
                  this.props.deleteComment(this.props.comment);
                }}
              />
            </ContextMenu>
          )}
        <div className="d-flex align-items-center mb-3 w-100">
          <div style={{flexGrow: 1}}>
            {this.state.editing ? (
              <CommentInput
                editing={this.state.editing}
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
              <div className="comment d-flex">
                <ProfileImage
                  id={user.openplatformId}
                  style={{marginRight: '15px', marginTop: '10px'}}
                  size="40"
                />
                <div className="d-flex flex-column w-100">
                  <Text type="small" variant="color-due" className="mb-1">
                    {timestampToLongDate(_created)}
                  </Text>
                  <div className="comment-nameComment-wrap">
                    <Text type="large" className="d-inline">
                      {user.name || ''}
                    </Text>
                    <div className="d-inline ml-2">{comment}</div>
                  </div>
                </div>
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
