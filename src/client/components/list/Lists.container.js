import React from 'react';
import {connect} from 'react-redux';
import {
  getListsForOwner,
  CUSTOM_LIST,
  SYSTEM_LIST
} from '../../redux/list.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';

const Cover = ({pid, title, width, height}) => (
  <BookCover
    book={{pid, title}}
    style={{width: width, height: height, objectFit: 'cover'}}
  />
);

const ListItem = ({list, title, id, image, type, hideIfEmpty = true}) => {
  if (list.length === 0 && hideIfEmpty === true) {
    return null;
  }

  let editButton = '';
  if (type === CUSTOM_LIST) {
    editButton = (
      <Link href={`/lister/${id}/rediger`} className="small ml1">
        Redigér
      </Link>
    );
  }

  return (
    <div className="list-item tl mb1">
      <Link href={`/lister/${id}`} className="list-image" style={{}}>
        {image ? <img src={image} alt={title} /> : ''}
      </Link>
      <div className="ml2" style={{flexGrow: 1}}>
        <Link href={`/lister/${id}`}>{title}</Link>
        {editButton}
      </div>
      <Link href={`/lister/${id}`} className="ml2">
        {list.slice(0, 5).map(el => {
          return (
            <span className="ml1" key={el.book.pid}>
              <Cover
                pid={el.book.pid}
                title={el.book.title}
                width="30px"
                height="45px"
              />
            </span>
          );
        })}
        <Link href={`/lister/${id}`} className="small ml1">
          Se hele listen
        </Link>
      </Link>
    </div>
  );
};

export class Lists extends React.Component {
  render() {
    return (
      <div className="lists-page">
        <div className="mb3">
          {this.props.systemLists.map(data => (
            <ListItem
              list={data.list}
              title={data.title}
              id={data.id}
              key={data.id}
              type={data.type}
              image={data.image}
              hideIfEmpty={false}
            />
          ))}
        </div>
        <div className="mb3">
          {this.props.lists.map(data => (
            <ListItem
              list={data.list}
              title={data.title}
              id={data.id}
              key={data.id}
              type={data.type}
              image={data.image ? `/v1/image/${data.image}/50/50` : null}
            />
          ))}
        </div>
        <div>
          <a
            href="/lister/opret"
            className="btn btn-primary"
            onClick={e => {
              this.props.dispatch({type: HISTORY_PUSH, path: '/lister/opret'});
              e.preventDefault();
            }}
          >
            Ny liste
            <span className="glyphicon glyphicon-plus ml4" />
          </a>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    lists: getListsForOwner(state.listReducer, {
      type: CUSTOM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    systemLists: getListsForOwner(state.listReducer, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    })
  };
};
export default connect(mapStateToProps)(Lists);
