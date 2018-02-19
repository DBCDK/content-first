import React from 'react';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';

export default class RollOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  hideRollOver() {
    this.setState({visible: false});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loading == true && nextProps.loading == false) {
      this.setState({visible: true});
    }
  }

  render() {
    const description = this.props.description.substring(0, 175) + '. . .';

    let styles = {
      left: this.props.position.x + '%',
      top: this.props.position.y + '%'
    };

    return (
      <div
        className={`rollover-container ${
          this.state.visible ? ' rollover-display' : ''
        }`}
        style={styles}
      >
        <div className="rollover">
          <div className="rollover-caret" />
          <img
            className="rollover-close"
            src="/static/media/Kryds.e69a54ef.svg"
            onClick={() => {
              this.hideRollOver();
            }}
          />
          <div className="col-xs-4 rollover-img">
            <BookCover book={this.props.book} />
          </div>
          <div className="col-xs-8 text-left rollover-text">
            <div className="col-xs-12 rollover-title">
              <h1 id="rollover-title">{this.props.book.title}</h1>
            </div>
            <div className="col-xs-12 rollover-description">
              <p id="rollover-desc">{description}</p>
            </div>
          </div>
          <div className="col-xs-12 rollover-button">
            <CheckmarkConnected
              book={{book: {pid: this.props.book.pid}}}
              origin="Fra bogreol"
            />
          </div>
        </div>
      </div>
    );
  }
}
