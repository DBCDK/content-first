import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import BookmarkButton from '../general/BookmarkButton';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import Link from '../general/Link.component';
import Paragraph from '../base/Paragraph';
import {getListsForOwner, SYSTEM_LIST} from '../../redux/list.reducer';
import './WorkCard.css';

export const SkeletonWorkCard = props => {
  return (
    <div className={'WorkCard' + ' ' + props.className}>
      <BookCover className="book-cover" book={{book: {}}} />
      <div
        className="skelet-taxonomy-description d-xs-none d-sm-block"
        style={{height: 12, width: '80%', background: '#f8f8f8', marginTop: 10}}
      />
      <div
        className="skelet-taxonomy-description d-xs-none d-sm-block"
        style={{
          height: 12,
          width: '100%',
          background: '#f8f8f8',
          marginTop: 10
        }}
      />
      <div
        className="skelet-taxonomy-description d-xs-none d-sm-block"
        style={{height: 12, width: '60%', background: '#f8f8f8', marginTop: 10}}
      />
    </div>
  );
};
class WorkCard extends React.Component {
  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };
  fetch = () => {
    if (this.props.allowFetch && !this.props.work) {
      this.props.fetchWork(this.props.pid);
    }
  };
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate() {
    this.fetch();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.work !== this.props.work ||
      nextProps.allowFetch !== this.props.allowFetch
    );
  }
  render() {
    if (!this.props.work || !this.props.work.detailsHasLoaded) {
      return <SkeletonWorkCard {...this.props} />;
    }
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;

    return (
      <div className={'WorkCard' + ' ' + this.props.className}>
        <Link href={`/værk/${this.props.work.book.pid}`}>
          <BookCover
            className="book-cover"
            book={this.props.skeleton ? {book: {}} : this.props.work.book}
          />
        </Link>
        <Paragraph className="mt1 d-xs-none d-sm-block">
          {tax_description}
        </Paragraph>
        <BookmarkButton
          origin={this.props.origin}
          work={this.props.work}
          style={{position: 'absolute', right: 0, top: 0}}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    work: state.booksReducer.books[ownProps.pid],
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
export const mapDispatchToProps = dispatch => ({
  fetchWork: pid =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: [pid]
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkCard);
