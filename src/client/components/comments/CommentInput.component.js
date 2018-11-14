import React from 'react';
import Textarea from 'react-textarea-autosize';
import ProfileImage from '../general/ProfileImage.component';
import Button from '../base/Button';

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
        >
          <Textarea
            autoFocus={this.props.autoFocus}
            ref={ref => (this.textarea = ref)}
            disabled={this.props.disabled}
            className={`form-control mb1 comment-textarea`}
            name="list-description"
            placeholder={this.props.placeholder || 'Skriv kommentar'}
            onChange={e => this.props.onChange(e.target.value)}
            onBlur={() => {
              this.setState({focus: false});
            }}
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
              height: this.state.focus || this.state.value ? '50px' : '0px',
              opacity: this.state.focus || this.state.value ? 1 : 0,
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
              {this.props.cancelText || 'Fortryd'}
            </Button>
            <Button
              id="comment-submit"
              type="quaternary"
              className="mr-2 ml-2"
              onClick={this.onSubmit}
              disabled={this.props.disabled || !this.props.value}
            >
              Kommentér
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
