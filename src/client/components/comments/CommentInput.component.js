import React from 'react';
import Textarea from 'react-textarea-autosize';
import ProfileImage from '../general/ProfileImage.component';

export default class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.value);
  };

  onCancel = () => {
    this.props.onCancel();
    this.setState({focus: false});
  };

  render() {
    if (!this.props.user.openplatformId) {
      return null;
    }
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        {!this.props.hideProfile ? (
          <ProfileImage user={this.props.user} style={{marginRight: '20px'}} />
        ) : null}
        <div
          style={{width: '100%'}}
          className={`form-group ${this.props.error ? 'has-error' : ''}`}
          onFocus={() => {
            this.setState({focus: true});
          }}
        >
          <Textarea
            autoFocus={this.props.autoFocus}
            ref={ref => (this.textarea = ref)}
            disabled={this.props.disabled}
            className={`form-control mb1 comment-textarea`}
            name="list-description"
            placeholder="Skriv kommentar"
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
              transition: 'height 200ms, opacity 200ms'
            }}
          >
            {this.props.onDelete ? (
              <button
                className="comment-delete btn btn-link link-subtle"
                onClick={this.props.onDelete}
              >
                Slet
              </button>
            ) : null}
            <button
              className="comment-cancel btn btn-link link-subtle"
              onClick={this.onCancel}
            >
              Fortryd
            </button>
            <button
              id="comment-submit"
              className="btn btn-success"
              onClick={this.onSubmit}
              disabled={this.props.disabled || !this.props.value}
            >
              Gem
            </button>
          </div>
        </div>
      </div>
    );
  }
}
