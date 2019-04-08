import React from 'react';
import {connect} from 'react-redux';
import toColor from '../../utils/toColor';
import Lightbox from 'react-images';
import './BookCover.css';

const generateSvg = (backgroundColor, title, creator) => {
  const adjustTitlelength =
    title.length > 20
      ? 'lengthAdjust="spacingAndGlyphs" textLength="180px" '
      : '';

  const adjustCreatorlength =
    creator.length > 20
      ? 'lengthAdjust="spacingAndGlyphs" textLength="180px" '
      : '';

  return `<svg
  width="100%"
  height="100%"
  viewBox="0 0 200 300"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio = "xMinYMin meet"
  >
  <rect x="0" y="0" width="200" height="300" fill="${backgroundColor}" stroke-width="0" />
  <text x="50%" y="30%" fill="white" font-family="Verdana" font-weight="bold" font="bold 30px" ${adjustTitlelength}class="title" alignment-baseline="middle" text-anchor="middle">
    ${title}
  </text>
  <text x="50%" y="40%" fill="white" font-family="Verdana" ${adjustCreatorlength}class="creator" alignment-baseline="middle" text-anchor="middle">
    ${creator}
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
        className={`d-inline-flex align-items-start align-items-md-end book-cover position-relative ${className}`}
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
          style={{...styles, ...clickableStyle}}
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
