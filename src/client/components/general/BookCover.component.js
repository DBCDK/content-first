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
    const hasNoCover = !this.props.coverUrl && this.props.coverUrlHasLoaded;
    const clickableStyle = this.props.enableLightbox ? {cursor: 'pointer'} : {};
    if (!this.props.coverUrl) {
      const svg =
        'data:image/svg+xml,' +
        encodeURIComponent(
          generateSvg(
            this.props.title && hasNoCover
              ? toColor(this.props.title)
              : '#f8f8f8',
            this.props.title && hasNoCover ? this.props.title : '',
            this.props.title && hasNoCover ? this.props.creator : ''
          )
        );
      return (
        <React.Fragment>
          <img
            style={{...this.props.style, ...clickableStyle}}
            src={svg}
            alt={this.props.title || ''}
            className={'book-cover ' + this.props.className || ''}
            onClick={() =>
              this.setState({lightboxIsOpen: this.props.enableLightbox})
            }
          />
          {this.props.enableLightbox && (
            <Lightbox
              images={[{src: svg}]}
              isOpen={this.state.lightboxIsOpen}
              onClose={() => {
                this.setState({lightboxIsOpen: false});
              }}
              backdropClosesModal={true}
              imageCountSeparator=" af "
            />
          )}
        </React.Fragment>
      );
    }
    return (
      <div
        style={{
          ...this.props.style,
          display: 'inline-block',
          textAlign: 'center',
          backgroundColor: '#f8f8f8',
          verticalAlign: 'middle'
        }}
        alt={this.props.title || ''}
        className={
          'd-inline-flex align-items-end book-cover ' + this.props.className ||
          ''
        }
      >
        {this.props.enableLightbox && (
          <Lightbox
            images={[{src: this.props.coverUrl, caption: this.props.title}]}
            isOpen={this.state.lightboxIsOpen}
            onClose={() => {
              this.setState({lightboxIsOpen: false});
            }}
            backdropClosesModal={true}
            imageCountSeparator=" af "
            showCloseButton={false}
            showImageCount={false}
          />
        )}
        <img
          style={{...this.props.style, ...clickableStyle}}
          alt={this.props.title || ''}
          src={this.props.coverUrl}
          onLoad={this.props.onLoad}
          className={this.props.imageClassName || ''}
          data-cy={this.props.dataCy || ''}
          onClick={() => {
            this.setState({lightboxIsOpen: this.props.enableLightbox});
          }}
        />
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
