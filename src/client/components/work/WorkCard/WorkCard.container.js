import React from 'react';
import BookCover from '../../general/BookCover/BookCover.component';
import BookmarkButton from '../../general/BookmarkButton/BookmarkButton';
import CompareButton from '../../general/CompareButton/CompareButton.component';
import TaxDescription from '../TaxDescription.component';
import SkeletonCard from '../../base/Skeleton/Card';
import Text from '../../base/Text';
import Title from '../../base/Title';
import Divider from '../../base/Divider';
import Icon from '../../base/Icon';
import {withWork} from '../../hoc/Work';
import RemindsOf from '../../base/RemindsOf';

import './WorkCard.css';
import HomeStatus from '../../kiosk/HomeStatus/HomeStatus';

class WorkCard extends React.Component {
  constructor() {
    super();
    this.state = {showCompareButton: false};
  }

  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.highlight !== this.props.highlight ||
      nextProps.work !== this.props.work ||
      nextProps.isVisible !== this.props.isVisible ||
      nextState.showCompareButton !== this.state.showCompareButton ||
      nextState.className !== this.props.className
    );
  }

  onWorkClick = () => {
    this.props.onWorkClick(this.props.work, this.props.origin, this.props.rid);
  };

  render() {
    const {
      pid,
      work,
      className,
      origin,
      rid,
      cardRef,
      isVisible,
      highlight,
      enableHover,
      skeleton,
      hideMoreLikeThis = false,
      onMoreLikeThisClick,
      description
    } = this.props;
    if (!work || !work.detailsHasLoaded || !isVisible) {
      return (
        <SkeletonCard
          className={`work-card ${className}`}
          cardRef={cardRef}
          data-cy={this.props['data-cy'] || 'workcard'}
        />
      );
    }

    const tax_description =
      work.book.taxonomy_description ||
      work.book.taxonomy_description_subjects ||
      `${work.book.title || ''}\n${work.book.creator || ''}`;

    const highlightClass = highlight ? 'highlight' : '';
    return (
      <div
        ref={cardRef || null}
        className={`work-card ${highlightClass} ${className}`}
        data-cy={this.props['data-cy'] || `workcard-${pid}`}
        data-hj-ignore-attributes
        onTouchStart={this.handleLongPress}
        onTouchEnd={this.handleLongRelease}
      >
        <div className="work-card__content">
          <BookCover
            pid={skeleton ? null : work.book.pid}
            onClick={this.onWorkClick}
          >
            {enableHover && (
              <React.Fragment>
                <div className="hover-details-fade" />
                <div className="hover-details" onClick={this.onWorkClick}>
                  <Title
                    className="work-card__title"
                    Tag="h1"
                    type="title6"
                    data-cy={'workcard-title'}
                  >
                    {work.book.title}
                  </Title>
                  <Title
                    className="work-card__creator"
                    Tag="h2"
                    type="title6"
                    variant="weight-normal"
                  >
                    {work.book.creator}
                  </Title>
                  {hideMoreLikeThis ? (
                    <Divider variant="thin" />
                  ) : (
                    <RemindsOf
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        onMoreLikeThisClick(work, origin, rid);
                      }}
                      data-cy="WC-more-like-this"
                    />
                  )}

                  <div className="expand-more-wrapper">
                    <Icon
                      name="expand_more"
                      className="md-large"
                      data-cy="expand-work-preview"
                    />
                  </div>
                </div>
              </React.Fragment>
            )}

            <div className="book-cover-content">
              <BookmarkButton
                className="icon-large"
                origin={origin}
                work={work}
                rid={rid}
                layout="circle"
                dataCy="bookmarkBtn"
                size="default"
              />
              <CompareButton main={origin.parent} pid={pid} />
            </div>
          </BookCover>

          <HomeStatus pid={pid} />
          <Text className="work-card__tax-description">
            <TaxDescription
              text={description ? description : tax_description}
            />
          </Text>
        </div>
        <div className="whiteLine" />
      </div>
    );
  }
}

export default withWork(WorkCard);
