import React from 'react';
import BookCover from '../../general/BookCover/BookCover.component';
import BookmarkButton from '../../general/BookmarkButton/BookmarkButton';
import CompareButton from '../../general/CompareButton/CompareButton.component';
import TaxDescription from '../TaxDescription.component';
import Text from '../../base/Text';
import Title from '../../base/Title';
import Icon from '../../base/Icon';
import {withWork} from '../../hoc/Work';
import RemindsOf from '../../base/RemindsOf';

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
        data-cy={this.props['data-cy'] || 'workcard'}
      >
        <div style={{height: '100%'}} onClick={this.onWorkClick}>
          <BookCover
            book={this.props.skeleton ? {book: {}} : this.props.work.book}
          >
            <div className="book-cover-content">
              <BookmarkButton
                className="icon-large"
                origin={this.props.origin}
                work={this.props.work}
                rid={this.props.rid}
                layout="circle"
                dataCy="bookmarkBtn"
                size="default"
              />
              <CompareButton
                main={this.props.origin.parent}
                pids={[this.props.origin.parent, this.props.pid]}
              />
            </div>
          </BookCover>

          <Text className="mt-2 d-xs-none d-sm-block">
            {<TaxDescription text={tax_description} />}
          </Text>

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
              <Title
                className="m-0"
                Tag="h1"
                type="title6"
                data-cy={'workcard-title'}
              >
                {this.props.work.book.title}
              </Title>
              <Title
                Tag="h2"
                type="title6"
                variant="weight-normal"
                className="mb-1"
              >
                {this.props.work.book.creator}
              </Title>
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
              <Text className="mt-2">
                {<TaxDescription text={tax_description} />}
              </Text>
              <div className="expand-more-wrapper text-center">
                <Icon name="&#xe5cf;" className="md-large" />
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
