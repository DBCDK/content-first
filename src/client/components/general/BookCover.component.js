import React from 'react';
import {connect} from 'react-redux';
import toColor from '../../utils/toColor';

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

const BookCover = props => {
  const hasNoCover = !props.coverUrl && props.coverUrlHasLoaded;
  if (!props.coverUrl) {
    return (
      <img
        style={props.style}
        src={
          'data:image/svg+xml,' +
          encodeURIComponent(
            generateSvg(
              props.title && hasNoCover ? toColor(props.title) : '#f8f8f8',
              props.title && hasNoCover ? props.title : '',
              props.title && hasNoCover ? props.creator : ''
            )
          )
        }
        alt={props.title || ''}
        className={'book-cover ' + props.className || ''}
      />
    );
  }
  return (
    <div
      style={{
        ...props.style,
        display: 'inline-block',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
        verticalAlign: 'middle'
      }}
      alt={props.title || ''}
      className={
        'd-inline-flex align-items-end book-cover ' + props.className || ''
      }
    >
      <img
        style={props.style}
        alt={props.title || ''}
        src={props.coverUrl}
        onLoad={props.onLoad}
      />
    </div>
  );
};

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
