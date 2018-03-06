import React from 'react';
import Textarea from 'react-textarea-autosize';
import CommentUserImage from './CommentUserImage.component';

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
    this.props.onChange('');
    this.setState({focus: false});
  };

  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <CommentUserImage user={this.props.user} />{' '}
        <div
          style={{width: '100%'}}
          className={`ml2 form-group ${this.props.error ? 'has-error' : ''}`}
          onFocus={() => {
            this.setState({focus: true});
          }}
        >
          <Textarea
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
              height: this.state.focus || this.state.value ? '35px' : '0px',
              opacity: this.state.focus || this.state.value ? 1 : 0,
              overflow: 'hidden',
              transition: 'height 200ms, opacity 200ms'
            }}
          >
            <button
              className="btn btn-link link-subtle"
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
