import React from 'react';
import Textarea from 'react-textarea-autosize';
import ProfileImage from '../general/ProfileImage.component';
import Button from '../base/Button';
import T from '../base/T';

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
    return (
      <div
        className={this.props.className}
        style={{
          display: 'flex'
        }}
      >
        {!this.props.hideProfile ? (
          <ProfileImage
            user={this.props.user}
            style={{marginRight: '10px'}}
            size="40"
          />
        ) : null}
        <div
          style={{width: '100%'}}
          className={`form-group ${this.props.error ? 'has-error' : ''}`}
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
            className={`form-control mb1 comment-textarea`}
            name="list-description"
            placeholder={
              this.props.placeholder ||
              T({component: 'post', name: 'writeComment'})
            }
            onChange={e => this.props.onChange(e.target.value)}
            value={this.props.value}
          />
          {this.props.error && this.props.error.comment === this.props.value ? (
            <div className="error">{this.props.error.error}</div>
          ) : (
            ''
          )}
          <div
            className="tr"
            style={{
              height: this.state.focus || this.props.value ? '50px' : '0px',
              opacity: this.state.focus || this.props.value ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 200ms'
            }}
          >
            <Button
              type="link"
              size="medium"
              className="comment-cancel mr-2 ml-2"
              onClick={this.onCancel}
            >
              {this.props.cancelText || <T component="general" name="cancel" />}
            </Button>
            <Button
              id="comment-submit"
              type="quaternary"
              className="mr-2 ml-2"
              onClick={this.onSubmit}
              disabled={this.props.disabled || !this.props.value}
            >
              <T component="post" name="comment" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
