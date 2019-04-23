import React from 'react';
import BookCover from '../general/BookCover/BookCover.component';
import BookmarkButton from '../general/BookmarkButton/BookmarkButton';
import TaxDescription from './TaxDescription.component';
import Paragraph from '../base/Paragraph';
import Heading from '../base/Heading';
import Icon from '../base/Icon';
import withWork from '../base/Work/withWork.hoc';
import RemindsOf from '../base/RemindsOf';

import './WorkCard.css';

export const SkeletonWorkCard = props => {
  return (
    <div ref={props.cardRef || null} className={'WorkCard ' + props.className}>
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
      <div className="whiteLine" />
    </div>
  );
};
class WorkCard extends React.Component {
  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.highlight !== this.props.highlight ||
      nextProps.work !== this.props.work
    );
  }

  onWorkClick = e => {
    e.stopPropagation();
    e.preventDefault();
    this.props.onWorkClick(this.props.work, this.props.origin, this.props.rid);
  };

  render() {
    if (!this.props.work || !this.props.work.detailsHasLoaded) {
      return <SkeletonWorkCard {...this.props} />;
    }
    // check if more-like-this button is disabled (default: false)
    const hideMoreLikeThis = this.props.hideMoreLikeThis || false;

    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.taxonomy_description_subjects ||
      `${this.props.work.book.title || ''}\n${this.props.work.book.creator ||
        ''}`;

    const highlight = this.props.highlight ? 'highlight' : '';

    return (
      <div
        ref={this.props.cardRef || null}
        className={`WorkCard ${highlight} ${this.props.className}`}
        data-cy={'workcard'}
      >
        <div style={{height: '100%'}} onClick={this.onWorkClick}>
          <BookCover
            book={this.props.skeleton ? {book: {}} : this.props.work.book}
          >
            <BookmarkButton
              className="icon-large"
              origin={this.props.origin}
              work={this.props.work}
              rid={this.props.rid}
              layout="teardrop"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '40px',
                height: '40px'
              }}
              dataCy="bookmarkBtn"
            />
          </BookCover>

          <Paragraph className="mt-2 d-xs-none d-sm-block">
            {<TaxDescription text={tax_description} />}
          </Paragraph>

          {this.props.enableHover && (
            <div
              className={`hover-details d-xs-none d-sm-block`}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '100%',
                width: '100%',
                paddingTop: '80%'
              }}
              onClick={this.onWorkClick}
            >
              <Heading
                Tag="h3"
                type="title"
                style={{marginBottom: 4}}
                data-cy={'workcard-title'}
              >
                {this.props.work.book.title}
              </Heading>
              <Heading Tag="h3" type="subtitle" className="mt0">
                {this.props.work.book.creator}
              </Heading>
              {hideMoreLikeThis ? (
                <hr className="w-100" />
              ) : (
                <RemindsOf
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onMoreLikeThisClick(
                      this.props.work,
                      this.props.origin,
                      this.props.rid
                    );
                  }}
                  data-cy="WC-more-like-this"
                />
              )}
              <Paragraph className="mt-2">
                {<TaxDescription text={tax_description} />}
              </Paragraph>
              <div className="expand-more-wrapper text-center">
                <Icon name="expand_more" className="md-large" />
              </div>
            </div>
          )}
        </div>
        <div className="whiteLine" />
      </div>
    );
  }
}

export default withWork(WorkCard);
