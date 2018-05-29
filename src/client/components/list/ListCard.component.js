import React from 'react';
import {connect} from 'react-redux';
import TruncateMarkup from 'react-truncate-markup';
import BookCover from '../general/BookCover.component';
import ProfileImage from '../general/ProfileImage.component';
import {Badge} from '../general/Icons';
import Link from '../general/Link.component';

class ListCard extends React.PureComponent {
  render() {
    const {list, style} = this.props;
    const elements = list.list;

    function renderBookCover(img) {
      let cardCover;
      if (img) {
        cardCover = (
          <div>
            <img alt="" src={'v1/image/' + img + '/220/120'} />
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
        <Link href={`/lister/${list.id}`} />
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
              namePosition={'right'}
              type="list"
              className="mb1"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    owner: state.userReducer.openplatformId
  };
};

export default connect(mapStateToProps)(ListCard);
