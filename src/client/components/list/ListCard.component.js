import React from 'react';
import TruncateMarkup from 'react-truncate-markup';
import BookCover from '../general/BookCover.component';
import ProfileImage from '../general/ProfileImage.component';
import {Likes, Comments, Badge} from '../general/Icons';

//New
import Link from '../general/Link.component';
//


class ListCard extends React.PureComponent {
  render() {
    const {list, style} = this.props;
    // console.log("list "+JSON.stringify(list))
    const profile = {
      name: 'Funky Bjarne',
      src: 'http://p-hold.com/200/200',
      description: 'This is a dummy profile. Profiles needs to be implemented'
    };
    const elements = list.list;
    return (
      <div className="list-card" style={style}>
      <Link href={`/lister/${list.id}`}>
        <div className="list-card-covers" >
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
        </div>

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
              src={profile.src}
              name={profile.name}
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
