import React from 'react';
import BookCover from '../../general/BookCover/BookCover.component';
import Link from '../../general/Link.component';
import T from '../../base/T';

const Cover = ({pid, title, coverUrl, width, height}) => (
  <BookCover
    book={{pid, title, coverUrl}}
    hideCoverText={true}
    style={{
      width: width,
      height: height,
      objectFit: 'cover'
    }}
  />
);

const ListItem = ({list, title, _id, image, hideIfEmpty = true}) => {
  if (!list || (list.length === 0 && hideIfEmpty === true)) {
    return null;
  }

  return (
    <div className="list-item tl mb1">
      <Link href={`/lister/${_id}`} className="list-image">
        {image ? <img src={image} alt={title} /> : ''}
      </Link>
      <div className="ml2" style={{flexGrow: 1}}>
        <Link href={`/lister/${_id}`} className="link-dark">
          {title}
        </Link>
      </div>
      <Link href={`/lister/${_id}`} className="ml2">
        {list.slice(0, 5).map(el => {
          return (
            <span className="ml1" key={el.pid}>
              <Cover pid={el.pid} book={el.book} width="30px" height="45px" />
            </span>
          );
        })}
        <Link href={`/lister/${_id}`} className="ml1 link-subtle inline">
          {list.length > 5 ? (
            <T
              component="list"
              name={list.length === 6 ? 'moreBook' : 'moreBooks'}
              vars={[list.length - 5]}
            />
          ) : (
            <T component="list" name={'showList'} />
          )}
        </Link>
      </Link>
    </div>
  );
};

export default ListItem;
