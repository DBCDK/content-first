import React from 'react';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import BookCover from '../general/BookCover.component';

/*
  <RollOver
    loading={true|false}
    position={{x:-,y:-}}
    description={'lorem ipsum...'}
    onClick={('next' | 'prev') => {
      this.nextBook(direction);
    }}
    book={book}
  />
*/

export default class RollOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loading === true && nextProps.loading === false) {
      this.setState({visible: true});
    }
  }

  hideRollOver() {
    this.setState({visible: false});
  }

  render() {
    const description = this.props.description.substring(0, 175) + '. . .';

    // Styles according to pulse
    /*
    let styles = {
      left: this.props.position.x + '%',
      top: this.props.position.y + '%'
    };
    */
    let styles = {};

    return (
      <div
        className={`rollover-container ${
          this.state.visible ? ' rollover-display' : ''
        }`}
        style={styles}
      >
        <div className="rollover">
          <img
            className="rollover-close"
            src="/static/media/Kryds.e69a54ef.svg"
            onClick={() => {
              this.hideRollOver();
            }}
          />
          <div className="col-4 rollover-img">
            <BookCover book={this.props.book} />
          </div>

          <div className="col-8 text-left rollover-text">
            <div className="col-12 rollover-title">
              <h1>{this.props.book.title}</h1>
            </div>
            <div className="col-12 rollover-creator">
              <h2>{this.props.book.creator}</h2>
            </div>
            <div className="col-12 rollover-description">
              <p>{description}</p>
            </div>
            <div className="col-12">
              <CheckmarkConnected
                book={{book: {pid: this.props.book.pid}}}
                origin="Fra bogreol"
              />
            </div>
          </div>

          <div className="col-12 seperator-line" />

          <div className="col-12 rollover-bottom">
            <span
              class="glyphicon glyphicon-chevron-right"
              aria-hidden="true"
              onClick={() => {
                this.props.onClick('next');
              }}
            />
            <span
              class="glyphicon glyphicon-chevron-left"
              aria-hidden="true"
              onClick={() => {
                this.props.onClick('prev');
              }}
            />
          </div>
          <div className="clear" />
        </div>
      </div>
    );
  }
}
