import React from 'react';
import toColor from '../../../utils/toColor';
import splitLine from '../../../utils/splitLine';
import Lightbox from 'react-images';

import withWork from '../../hoc/Work/withWork.hoc';

import './BookCover.css';

const generateSvg = (backgroundColor, title, creator) => {
  const titleLines = splitLine(title, 18, 6).map(encodeEntities);
  const tspanTitle =
    '<tspan x="50%">' +
    titleLines.join('</tspan><tspan x="50%" dy="1.1em">') +
    '</tspan>';
  const creatorLines = splitLine(creator, 18, 2).map(encodeEntities);
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

const SkeletonCover = ({className}) => {
  // Generate transparent svg
  const svg =
    'data:image/svg+xml,' +
    encodeURIComponent(generateSvg('transparent', '', ''));
  return (
    <div className={`book-cover ${className}`}>
      <img src={svg} alt="bookcover" />
    </div>
  );
};

const encodeEntities = line => {
  return line.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
};

class BookCover extends React.Component {
  constructor() {
    super();
    this.state = {lightboxIsOpen: false};
  }

  render() {
    const {
      pid,
      work,
      className = '',
      enableLightbox,
      onLoad,
      dataCy = '',
      children,
      onClick
    } = this.props;

    if (!pid || !work || !work.detailsHasLoaded) {
      return <SkeletonCover className={className} />;
    }

    const book = work.book;

    const clickableClass = enableLightbox ? 'lightbox__enabled' : '';

    // If the book has no cover, generate svg cover.
    const cover = book.coverUrl
      ? book.coverUrl
      : 'data:image/svg+xml,' +
        encodeURIComponent(
          generateSvg(
            book.title ? toColor(book.title) : 'transparent',
            book.title,
            book.creator
          )
        );

    return (
      <div
        aria-label={book.title}
        className={`book-cover ${className}`}
        onClick={onClick}
        data-cy="book-cover-loaded"
      >
        {enableLightbox && (
          <Lightbox
            images={[{src: cover, caption: book.title}]}
            isOpen={this.state.lightboxIsOpen}
            onClose={() => {
              this.setState({lightboxIsOpen: false});
            }}
            backdropClosesModal={true}
            showImageCount={false}
          />
        )}
        <img
          alt=""
          src={cover}
          onLoad={onLoad}
          className={`${clickableClass}`}
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

export default withWork(BookCover);
