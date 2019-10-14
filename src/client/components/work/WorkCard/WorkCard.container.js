import React from 'react';
import {isMobile} from 'react-device-detect';
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

class WorkCard extends React.Component {
  constructor() {
    super();
    this.state = {showCompareButton: false};
  }

  static defaultProps = {
    showTaxonomy: true,
    workClass: 'work'
  };

  componentDidMount() {
    if (this.props.enableLongpress) {
      this.shouldUpdate = true;
      document.addEventListener('touchstart', this.resetLongpress);
    }
  }

  componentWillUnmount() {
    if (this.props.enableLongpress) {
      this.shouldUpdate = false;
      document.removeEventListener('touchstart', this.resetLongpress);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.highlight !== this.props.highlight ||
      nextProps.work !== this.props.work ||
      nextProps.isVisible !== this.props.isVisible ||
      nextState.showCompareButton !== this.state.showCompareButton
    );
  }

  touchEnd = () => {
    if (isMobile) {
      this.setState({showCompareButton: false});
    }
  };

  resetLongpress = () => {
    if (isMobile) {
      setTimeout(() => {
        if (this.shouldUpdate) {
          this.setState({showCompareButton: false});
        }
      }, 200);
    }
    return this.resetLongpress;
  };

  handleLongPress = () => {
    if (this.props.enableLongpress) {
      this.buttonPressTimer = setTimeout(
        () => this.setState({showCompareButton: true}),
        1000
      );
    }
  };

  handleLongRelease = () => {
    if (this.props.enableLongpress) {
      clearTimeout(this.buttonPressTimer);
    }
  };

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
      onMoreLikeThisClick
    } = this.props;

    if (!work || !work.detailsHasLoaded || !isVisible) {
      return <SkeletonCard className="work-card" cardRef={cardRef} />;
    }

    const compareButtonIsVisible = this.state.showCompareButton;
    const compareButtonVisibleClass = compareButtonIsVisible ? 'active' : '';

    const tax_description =
      work.book.taxonomy_description ||
      work.book.taxonomy_description_subjects ||
      `${work.book.title || ''}\n${work.book.creator || ''}`;

    const highlightClass = highlight ? 'highlight' : '';

    return (
      <div
        ref={cardRef || null}
        className={`work-card ${highlightClass} ${className}`}
        data-cy={this.props['data-cy'] || 'workcard'}
        data-hj-ignore-attributes
        onTouchStart={this.handleLongPress}
        onTouchEnd={this.handleLongRelease}
      >
        <div className="work-card__content" onClick={this.onWorkClick}>
          <BookCover pid={skeleton ? null : work.book.pid}>
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
                  {!hideMoreLikeThis ? (
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
                    <Icon name="expand_more" className="md-large" />
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
              <CompareButton
                active={compareButtonIsVisible}
                className={`${compareButtonVisibleClass}`}
                main={origin.parent}
                pid={pid}
              />
            </div>
          </BookCover>

          <Text className="work-card__tax-description">
            {<TaxDescription text={tax_description} />}
          </Text>
        </div>
        <div className="whiteLine" />
      </div>
    );
  }
}

export default withWork(WorkCard);
