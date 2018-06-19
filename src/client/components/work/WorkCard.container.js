import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import Link from '../general/Link.component';
import {getListsForOwner, SYSTEM_LIST} from '../../redux/list.reducer';
import './WorkCard.css';

export const SkeletonWorkCard = props => {
  return (
    <div className={'WorkCard' + ' ' + props.className}>
      <div className="cover-wrapper">
        <BookCover book={{book: {}}} />
      </div>
      <div className="taxonomy-description">nææ</div>
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
    if (!this.props.work || !this.props.work.book) {
      return <SkeletonWorkCard {...this.props} />;
    }
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;

    return (
      <div className={'WorkCard' + ' ' + this.props.className}>
        <Link href={`/værk/${this.props.work.book.pid}`}>
          <div className="cover-wrapper">
            <BookCover
              book={this.props.skeleton ? {book: {}} : this.props.work.book}
            />
          </div>
        </Link>
        <div className="taxonomy-description">{tax_description}</div>
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
