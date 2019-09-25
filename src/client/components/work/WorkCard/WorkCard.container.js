import React from 'react';
import {isMobile} from 'react-device-detect';
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
    <div
      ref={props.cardRef || null}
      className={'WorkCard ' + props.className}
      data-hj-ignore-attributes
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
      <div className="whiteLine" />
    </div>
  );
};
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
    if (
      !this.props.work ||
      !this.props.work.detailsHasLoaded ||
      !this.props.isVisible
    ) {
      return <SkeletonWorkCard {...this.props} />;
    }
    // check if more-like-this button is disabled (default: false)
    const hideMoreLikeThis = this.props.hideMoreLikeThis || false;

    const compareButtonIsVisible = this.state.showCompareButton;
    const compareButtonVisibleClass = compareButtonIsVisible ? 'active' : '';

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
        data-hj-ignore-attributes
        onTouchStart={this.handleLongPress}
        onTouchEnd={this.handleLongRelease}
      >
        <div style={{height: '100%'}} onClick={this.onWorkClick}>
          <BookCover
            book={this.props.skeleton ? {book: {}} : this.props.work.book}
          >
            {this.props.enableHover && (
              <React.Fragment>
                <div className="hover-details-fade d-xs-none d-sm-block" />
                <div
                  className={`hover-details d-xs-none d-sm-block`}
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

                  <div className="expand-more-wrapper text-center">
                    <Icon name="&#xe5cf;" className="md-large" />
                  </div>
                </div>
              </React.Fragment>
            )}

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
                active={compareButtonIsVisible}
                className={`${compareButtonVisibleClass}`}
                main={this.props.origin.parent}
                pid={this.props.pid}
              />
            </div>
          </BookCover>

          <Text className="mt-2 d-xs-none d-sm-block">
            {<TaxDescription text={tax_description} />}
          </Text>
        </div>
        <div className="whiteLine" />
      </div>
    );
  }
}

export default withWork(WorkCard);
