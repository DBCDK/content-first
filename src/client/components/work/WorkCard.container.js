import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import BookmarkButton from '../general/BookmarkButton';
import Heading from '../base/Heading';
import Button from '../base/Button';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import Paragraph from '../base/Paragraph';
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
      nextProps.highlight !== this.props.highlight ||
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
      <div
        className={
          'WorkCard' +
          (this.props.highlight ? ' highlight' : '') +
          ' ' +
          this.props.className
        }
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          this.props.onWorkPreviewClick(this.props.work);
        }}
      >
        <BookCover
          className="book-cover"
          book={this.props.skeleton ? {book: {}} : this.props.work.book}
        />

        <Paragraph className="mt1 d-xs-none d-sm-block">
          {tax_description}
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
          >
            <Heading Tag="h3" type="title" style={{marginBottom: 4}}>
              {this.props.work.book.title}
            </Heading>
            <Heading Tag="h3" type="subtitle" className="mt0">
              {this.props.work.book.creator}
            </Heading>
            <Button
              type="tertiary"
              size="small"
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                this.props.onMoreLikeThisClick(this.props.work);
              }}
            >
              Mere som denne
            </Button>
            <Paragraph className="mt1">{tax_description}</Paragraph>
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
        <BookmarkButton
          origin={this.props.origin}
          work={this.props.work}
          layout="circle"
          style={{position: 'absolute', right: 0, top: 0}}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkCard);
