import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';
import {HISTORY_PUSH} from '../../redux/middleware';
import {getListsForOwner, SYSTEM_LIST} from '../../redux/list.reducer';
import './WorkCard.css';

class WorkCard extends React.PureComponent {
  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };
  render() {
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;
    return (
      <div className={'WorkCard' + ' ' + this.props.className}>
        <Link href={`/værk/${this.props.work.book.pid}`}>
          <div className="cover-wrapper">
            <BookCover book={this.props.work.book} />
          </div>
        </Link>
        <div className="taxonomy-description">{tax_description}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer,
    systemLists: getListsForOwner(state.listReducer, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    changeMap: state.listReducer.changeMap,
    user: state.userReducer
  };
};

export default connect(mapStateToProps)(WorkCard);
