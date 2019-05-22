import React from 'react';
import {connect} from 'react-redux';
import toColor from '../../../utils/toColor';
import splitLine from '../../../utils/splitLine';
import Lightbox from 'react-images';
import './BookCover.css';

const generateSvg = (backgroundColor, title, creator) => {
  const titleLines = splitLine(title, 18, 6);
  const tspanTitle =
    '<tspan x="50%">' +
    titleLines.join('</tspan><tspan x="50%" dy="1.1em">') +
    '</tspan>';
  const creatorLines = splitLine(creator, 18, 2);
  const tspanCreator =
    '<tspan x="50%">' +
    creatorLines.join('</tspan><tspan x="50%" dy="1.1em">') +
    '</tspan>';
  const creatorPos = 6 + titleLines.length;

  return `<svg
  width="100%"
  height="100%"
  viewBox="0 0 200 300"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio = "xMinYMin meet"
  >
  <rect x="0" y="0" width="200" height="300" fill="${backgroundColor}" stroke-width="0" />
  <text x="50%" y="5em" fill="white" font-family="Verdana" font-weight="bold" font="bold 30px" class="title" alignment-baseline="middle" text-anchor="middle">
    ${tspanTitle}
  </text>
  <text x="50%" y="${creatorPos}.4em" fill="white" font-family="Verdana" class="creator" alignment-baseline="middle" text-anchor="middle">
    ${tspanCreator}
  </text>
  </svg>`;
};

class BookCover extends React.Component {
  constructor() {
    super();
    this.state = {lightboxIsOpen: false};
  }

  render() {
    const {
      title = '',
      creator = '',
      coverUrl,
      enableLightbox,
      className = '',
      imageClassName = '',
      onLoad,
      dataCy = '',
      styles,
      children
    } = this.props;

    const clickableStyle = enableLightbox ? {cursor: 'pointer'} : {};
    const coverSvg =
      'data:image/svg+xml,' +
      encodeURIComponent(
        generateSvg(title ? toColor(title) : 'transparent', title, creator)
      );

    return (
      <div
        style={{
          ...styles
        }}
        alt={title}
        className={`d-flex align-items-start book-cover text-center position-relative ${className}`}
      >
        {enableLightbox && (
          <Lightbox
            images={[{src: coverUrl || coverSvg, caption: title}]}
            isOpen={this.state.lightboxIsOpen}
            onClose={() => {
              this.setState({lightboxIsOpen: false});
            }}
            backdropClosesModal={true}
            showImageCount={false}
          />
        )}
        <img
          style={{
            ...styles,
            ...clickableStyle,
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            height: 'auto'
          }}
          alt={title}
          src={coverUrl || coverSvg}
          onLoad={onLoad}
          className={imageClassName || ''}
          data-cy={dataCy}
          onClick={() => {
            this.setState({lightboxIsOpen: enableLightbox});
          }}
        />
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {book, coverHasLoaded} =
    state.booksReducer.books[ownProps.book.pid] || {};
  return {
    coverUrl: book && book.coverUrl,
    coverUrlHasLoaded: coverHasLoaded,
    title: book && book.title,
    creator: book && book.creator
  };
};

export default connect(mapStateToProps)(BookCover);
