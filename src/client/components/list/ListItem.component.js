import React from 'react';
import {CUSTOM_LIST} from '../../redux/list.reducer';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';

const Cover = ({pid, title, coverUrl, width, height}) => (
  <BookCover
    book={{pid, title, coverUrl}}
    style={{
      width: width,
      height: height,
      objectFit: 'cover'
    }}
  />
);

const ListItem = ({list, title, id, image, type, hideIfEmpty = true}) => {
  if (list.length === 0 && hideIfEmpty === true) {
    return null;
  }

  let editButton = '';
  if (type === CUSTOM_LIST) {
    editButton = (
      <Link href={`/lister/${id}/rediger`} className="small ml1 link-subtle">
        Redigér
      </Link>
    );
  }

  return (
    <div className="list-item tl mb1">
      <Link href={`/lister/${id}`} className="list-image">
        {image ? <img src={image} alt={title} /> : ''}
      </Link>
      <div className="ml2" style={{flexGrow: 1}}>
        <Link href={`/lister/${id}`} className="link-dark">
          {title}
        </Link>
        {editButton}
      </div>
      <Link href={`/lister/${id}`} className="ml2">
        {list.slice(0, 5).map(el => {
          return (
            <span className="ml1" key={el.book.pid}>
              <Cover
                pid={el.book.pid}
                title={el.book.title}
                coverUrl={el.book.coverUrl}
                width="30px"
                height="45px"
              />
            </span>
          );
        })}
        <Link href={`/lister/${id}`} className="ml1 link-subtle inline">
          {list.length === 6
            ? '+ 1 bog mere'
            : list.length > 6 ? `+ ${list.length - 5} bøger mere` : 'Se listen'}
        </Link>
      </Link>
    </div>
  );
};

export default ListItem;
