import React from 'react';
import Textarea from 'react-textarea-autosize';
import ProfileImage from '../general/ProfileImage.component';
import Button from '../base/Button';
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
    const {className} = this.props;

    return (
      <div
        className={`comment-textarea-wrap ${className}`}
        style={{
          display: 'flex'
        }}
      >
        {!this.props.hideProfile ? (
          <ProfileImage
            user={this.props.user}
            style={{marginRight: '15px'}}
            size="40"
          />
        ) : null}
        <div
          style={{width: '100%', border: '1px solid red'}}
          className={`${this.props.error ? 'has-error' : ''}`}
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
          <Textarea
            autoFocus={this.props.autoFocus}
            ref={ref => (this.textarea = ref)}
            disabled={this.props.disabled}
            className={`comment-textarea border-0`}
            name="list-description"
            placeholder={
              this.props.placeholder ||
              T({component: 'post', name: 'yourComment'})
            }
            onChange={e => this.props.onChange(e.target.value)}
            value={this.props.value}
          />
          {this.props.error && this.props.error.comment === this.props.value ? (
            <div className="error">{this.props.error.error}</div>
          ) : (
            ''
          )}

          <Icon
            id="comment-submit"
            name="send"
            onClick={this.onSubmit}
            disabled={this.props.disabled || !this.props.value}
          />
        </div>
      </div>
    );
  }
}
