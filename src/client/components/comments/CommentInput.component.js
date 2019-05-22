import React from 'react';
import Textarea from 'react-textarea-autosize';

import ProfileImage from '../general/ProfileImage.component';
import T from '../base/T';
import Icon from '../base/Icon';

export default class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.value);
    this.setState({focus: false});
  };

  onCancel = () => {
    this.props.onCancel();
    this.setState({focus: false});
  };

  render() {
    const {
      className = '',
      submitIcon = 'send',
      editIcon = 'check',
      hideProfile,
      editing
    } = this.props;

    return (
      <div
        className={`comment-textarea-wrap mb-3 d-flex ${className}`}
        style={{
          marginTop: editing ? '10px' : 0
        }}
      >
        {!hideProfile && (
          <ProfileImage
            user={this.props.user}
            style={{marginRight: '15px'}}
            size="40"
          />
        )}
        <div
          className={`d-flex flex-wrap align-items-center w-100 ${
            this.props.error ? 'has-error' : ''
          }`}
          onFocus={() => {
            if (!this.props.user.openplatformId) {
              if (this.props.requireLogin) {
                this.props.requireLogin();
              }
              return;
            }
            this.setState({focus: true});
          }}
          onBlur={() => {
            this.setState({focus: false});
          }}
        >
          {!this.props.user.openplatformId && (
            <div
              style={{
                position: 'absolute',
                width: '235px',
                height: '40px',
                backgroundColor: 'transparent'
              }}
              onClick={() => {
                if (this.props.requireLogin) {
                  this.props.requireLogin();
                }
              }}
            />
          )}
          <div
            className="d-flex w-100"
            style={{
              border: '1px solid #E9EAEB',
              overflow: 'hidden'
            }}
          >
            <Textarea
              autoFocus={this.props.autoFocus}
              ref={ref => (this.textarea = ref)}
              disabled={this.props.disabled}
              className={'comment-textarea border-0 pl-3'}
              name="list-description"
              placeholder={
                this.props.placeholder ||
                T({component: 'post', name: 'yourComment'})
              }
              onChange={e => this.props.onChange(e.target.value)}
              value={this.props.value}
            />
            <Icon
              id="comment-submit"
              className="comment-submit-icon align-self-end"
              name={editing ? editIcon : submitIcon}
              onClick={this.onSubmit}
              disabled={this.props.disabled || !this.props.value}
            />
          </div>
          {this.props.error &&
            this.props.error.comment === this.props.value && (
              <div className="error">{this.props.error.error}</div>
            )}
        </div>
      </div>
    );
  }
}
