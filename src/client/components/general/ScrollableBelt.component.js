import React from 'react';

class ScrollableBelt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scrollOffset: 0};
  }

  render() {
    const scrollPos = this.state.scrollOffset
      ? -1 * this.state.scrollOffset * 265 + 'px'
      : '0px';
    return (
      <div className="belt-wrapper">
        {this.props.children && (
          <div className="button-wrapper col-xs-12 noselect">
            <div
              className="left-btn scroll-btn text-center"
              onClick={() => {
                this.setState({
                  scrollOffset: Math.max(
                    this.state.scrollOffset - this.props.scrollInterval,
                    0
                  )
                });
              }}
            >
              {'<'}
            </div>
            <div
              className="right-btn scroll-btn text-center"
              onClick={() => {
                this.setState({
                  scrollOffset: Math.min(
                    this.state.scrollOffset + this.props.scrollInterval,
                    this.props.children.length - 5
                  )
                });
              }}
            >
              {'>'}
            </div>
          </div>
        )}
        <div className="works-wrapper col-xs-12 noselect">
          <div
            className="works"
            style={{transform: `translate3d(${scrollPos}, 0px, 0px)`}}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default ScrollableBelt;
