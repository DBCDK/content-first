import React from 'react';

class BookCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current: 0};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.book !== this.props.book) {
      this.setState({current: 0});
    }
  }
  render() {
    const urls = [
      `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(
        this.props.book.pid
      )}`,
      `/v1/image/${encodeURIComponent(this.props.book.pid)}`,
      '/default-book-cover.png'
    ];
    return (
      <img
        style={this.props.style}
        alt={this.props.book.title || ''}
        className={'high-contrast ' + (this.props.className || '')}
        src={urls[this.state.current]}
        onError={() => {
          this.setState({
            current: Math.min(this.state.current + 1, urls.length - 1)
          });
        }}
      />
    );
  }
}

export default BookCover;
