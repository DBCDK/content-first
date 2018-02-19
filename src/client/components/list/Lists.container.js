import React from 'react';
import {connect} from 'react-redux';
import {getLists, CUSTOM_LIST} from '../../redux/list.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';

const Cover = ({pid, title, width, height}) => (
  <BookCover
    book={{pid, title}}
    style={{width: width, height: height, objectFit: 'cover'}}
  />
);

const ListItem = ({list, title, id, image}) => {
  if (list.length === 0) {
    return null;
  }
  return (
    <div className="list-item tl mb1">
      <Link href={`/lister/${id}`} className="list-image" style={{}}>
        {image ? <img src={image} alt={title} /> : ''}
      </Link>
      <div className="ml2" style={{flexGrow: 1}}>
        <Link href={`/lister/${id}`}>{title}</Link>
        <Link href={`/lister/${id}/rediger`} className="small ml1">
          Redigér
        </Link>
      </div>
      < Link href={`/lister/${id}`} className="ml2">
        {list.map(el => (
          <span className="ml1" key={el.pid}>
            <Cover pid={el.pid} title={el.title} width="30px" height="45px" />
          </span>
        ))}
        <Link href={`/lister/${id}`} className="small ml1">
          Se hele listen
        </Link>
      </Link>
    </div>
  );
};

class Lists extends React.Component {
  render() {
    return (
      <div className="lists-page">
        <div className="mb3">
          {this.props.lists.map(({data}) => (
            <ListItem
              list={data.list}
              title={data.title}
              id={data.id}
              key={data.id}
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
    lists: getLists(state.listReducer, {
      type: CUSTOM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    })
  };
};
export default connect(mapStateToProps)(Lists);
