import React from 'react';
import TruncateMarkup from 'react-truncate-markup';
import BookCover from '../general/BookCover.component';
import ProfileImage from '../general/ProfileImage.component';
import {Likes, Comments, Badge} from '../general/Icons';
import Link from '../general/Link.component';

class ListCard extends React.PureComponent {
  render() {
    const {list, style} = this.props;
    const elements = list.list;

    function renderBookCover(img) {
      let cardCover;
      if (img && elements.length === 0) {
        cardCover = (
          <div>
            <img src={'v1/image/' + img + '/220/120'} />
          </div>
        );
      } else {
        cardCover = (
          <div className="list-card-covers-wrapper">
            {elements.length > 0 &&
              elements.slice(0, 3).map(e => {
                return (
                  <BookCover
                    key={e.book.pid}
                    className="list-card-cover"
                    book={e.book}
                  />
                );
              })}
          </div>
        );
      }

      return cardCover;
    }

    return (
      <div className="list-card" style={style}>
        <Link href={`/lister/${list.id}`}>
          <div className="list-card-covers">{renderBookCover(list.image)}</div>
          <div className="list-card-summary">
            <TruncateMarkup
              lines={2}
              ellipsis={
                <span>
                  ...<Badge value={elements.length} className="ml1" />
                </span>
              }
            >
              <h3 className="list-card-title h-tight">
                {list.title}
                <Badge value={elements.length} className="ml1" />
              </h3>
            </TruncateMarkup>
            <TruncateMarkup lines={3}>
              <div className="list-card-description">{list.description}</div>
            </TruncateMarkup>
          </div>
          <div className="list-card-bottom">
            <div style={{display: 'inline-block'}}>
              <ProfileImage
                user={this.props.profile}
                size={'35'}
                namePosition={'right'}
                type="list"
                className="mb1"
              />
            </div>
            <div style={{float: 'right', marginTop: 5}}>
              <Likes value={14} />
              <Comments value={14} className="ml1" />
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default ListCard;
