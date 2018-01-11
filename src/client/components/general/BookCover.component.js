import React from 'react';

class BookCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current: 0};
    this.urls = [
      `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(
        props.book.pid
      )}`,
      `/v1/image/${encodeURIComponent(props.book.pid)}`,
      '/default-book-cover.png'
    ];
  }

  render() {
    return (
      <img
        alt={this.props.book.title || ''}
        className={'high-contrast ' + (this.props.className || '')}
        src={this.urls[this.state.current]}
        onError={() => {
          this.setState({
            current: Math.min(this.state.current + 1, this.urls.length - 1)
          });
        }}
      />
    );
  }
}

export default BookCover;
