import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import BookmarkButton from '../general/BookmarkButton';
import TaxDescription from './TaxDescription.component';
import Paragraph from '../base/Paragraph';
import Heading from '../base/Heading';
import Button from '../base/Button';
import {BOOKS_REQUEST} from '../../redux/books.reducer';

import './WorkCard.css';

export const SkeletonWorkCard = props => {
  return (
    <div
      ref={props.cardRef || null}
      className={'WorkCard' + ' ' + props.className}
    >
      <BookCover book={{book: {}}} />
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
    if (this.props.allowFetch) {
      if (!this.props.work || !this.props.work.coverHasLoaded) {
        this.props.fetchWork(this.props.pid);
      }
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
      nextProps.highlight !== this.props.highlight ||
      nextProps.work !== this.props.work ||
      nextProps.allowFetch !== this.props.allowFetch ||
      nextProps.cardRef !== this.props.cardRef
    );
  }

  render() {
    if (!this.props.work || !this.props.work.detailsHasLoaded) {
      return <SkeletonWorkCard {...this.props} />;
    }

    // check if more-like-this button is disabled (default: false)
    const hideMoreLikeThis = this.props.hideMoreLikeThis || false;

    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;

    return (
      <div
        ref={this.props.cardRef || null}
        className={
          'WorkCard' +
          (this.props.highlight ? ' highlight' : '') +
          ' ' +
          this.props.className
        }
        data-cy={'workcard' + this.props.index}
      >
        <BookmarkButton
          origin={this.props.origin}
          work={this.props.work}
          layout="teardrop"
          style={{position: 'absolute', right: 0, top: 0}}
        />
        <div
          style={{height: '100%'}}
          onClick={() =>
            this.props.onWorkClick(this.props.work, this.props.rowId)
          }
        >
          <BookCover
            className="book-cover"
            book={this.props.skeleton ? {book: {}} : this.props.work.book}
          />

          <Paragraph className="mt1 d-xs-none d-sm-block">
            {<TaxDescription text={tax_description} />}
          </Paragraph>

          {this.props.enableHover && (
            <div
              className="hover-details d-xs-none d-sm-block"
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '100%',
                width: '100%',
                paddingTop: '80%'
              }}
              onClick={() =>
                this.props.onWorkClick(this.props.work, this.props.rowId)
              }
            >
              <Heading Tag="h3" type="title" style={{marginBottom: 4}}>
                {this.props.work.book.title}
              </Heading>
              <Heading Tag="h3" type="subtitle" className="mt0">
                {this.props.work.book.creator}
              </Heading>
              {hideMoreLikeThis ? (
                <hr className="w-100" />
              ) : (
                <Button
                  type="tertiary"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onMoreLikeThisClick(
                      this.props.work,
                      this.props.rowId
                    );
                  }}
                >
                  Mere som denne
                </Button>
              )}
              <Paragraph className="mt1">
                {<TaxDescription text={tax_description} />}
              </Paragraph>
              <div className="expand-more-wrapper text-center">
                <i
                  className="expand-more material-icons"
                  style={{
                    fontSize: this.props.highlight ? 36 : 36,
                    marginTop: this.props.highlight ? 10 : 0
                  }}
                >
                  expand_more
                </i>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    work: state.booksReducer.books[ownProps.pid]
  };
};
export const mapDispatchToProps = dispatch => ({
  fetchWork: pid =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: [pid]
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkCard);
