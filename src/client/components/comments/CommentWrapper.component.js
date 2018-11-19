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
              onClick={() => this.toggleEdit(!this.state.editing)}
            />

            <ContextMenuAction
              title="Slet indlæg"
              icon="clear"
              onClick={() => this.props.deleteComment(this.props.comment)}
            />
          </ContextMenu>
        ) : null}
        <div className="flex mb2" style={{width: '100%'}}>
          <ProfileImage
            user={user}
            style={{flexShrink: 0}}
            style={{marginRight: '10px'}}
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
                <div className="d-flex align-items-center">
                  <Text type="large" className="mb-2">
                    {user.name || ''}
                  </Text>
                  <Text
                    type="small"
                    variant="color-due"
                    className="ml-4 mb-2 d-none d-md-block"
                  >
                    {timeToString(_created)}
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
    dispatch({type: TOGGLE_EDIT_COMMENT, comment, editing})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentWrapper);
