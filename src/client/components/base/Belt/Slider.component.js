import React from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';
import Icon from '../Icon';
import './Slider.css';

class MobileSlider extends React.Component {
  constructor(props) {
    super(props);
    this.index = props.initialScrollPos || 0;
  }

  componentDidMount() {
    this.slider.scrollLeft =
      (this.slider.scrollWidth / this.props.children.length) * this.index;
  }

  render() {
    return (
      <div
        ref={node => {
          if (node) {
            this.slider = node;
          }
        }}
        className="mobile-slider-wrapper"
        onScroll={e => {
          const index = Math.floor(
            e.target.scrollLeft /
              (e.target.scrollWidth / this.props.children.length)
          );
          if (this.index !== index) {
            this.index = index;
            if (this.props.onSwipe) {
              this.props.onSwipe(this.index);
            }
          }
        }}
      >
        <div className="mobile-slider">{this.props.children}</div>
      </div>
    );
  }
}

class DesktopSlider extends React.Component {
  init = swiper => {
    if (swiper.pagination.bullets.length !== this.state.noOfPages) {
      this.setState({
        noOfPages: swiper.pagination.bullets.length
      });
    }
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('transitionStart', this.onSwipe);
      let isReallyEnd = this.getIsEnd(this.swiper);
      this.setState({
        isBeginning: this.swiper.isBeginning,
        isEnd: isReallyEnd,
        noOfPages: this.swiper.pagination.bullets.length
      });
    }
  };
  onSwipe = () => {
    let isReallyEnd = this.getIsEnd(this.swiper);
    this.setState({
      isBeginning: this.swiper.isBeginning,
      isEnd: isReallyEnd,
      index: this.swiper.realIndex,
      noOfPages: this.swiper.pagination.bullets.length
    });

    if (this.props.onSwipe) {
      this.props.onSwipe(
        this.swiper.isEnd
          ? this.props.children.length - 1
          : this.swiper.realIndex
      );
    }
  };
  setSwiper = () => {
    let p = 'show';
    if (this.state.noOfPages < 2) {
      p = 'hide';
    }
    let props = this.props;
    const desktopParams = {
      pagination: {
        el:
          '.swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-' +
          p,
        clickable: true
      },
      navigation: {
        // nextEl: '.swiper-button-next',
        // prevEl: '.swiper-button-prev'
      },
      slidesPerView: 'auto',
      slidesPerGroup: 3,
      rebuildOnUpdate: false
    };

    const params = {...desktopParams, freeMode: this.props.isKiosk};

    return (
      <Swiper
        {...params}
        initialSlide={this.initialScrollPos}
        ref={node => {
          if (node) {
            this.init(node.swiper);
          }
        }}
      >
        {props.children}
      </Swiper>
    );
  };

  getIsEnd = swiper => {
    return (
      swiper.isEnd ||
      swiper.pagination.bullets.length < 2 ||
      this.props.children.length < 4
    );
  };

  constructor(props) {
    super(props);
    this.initialScrollPos = props.initialScrollPos || 0;
    this.state = {isBeginning: true, isEnd: false, noOfPages: 3};
  }

  componentDidUpdate(prevProps) {
    if (this.swiper) {
      if (this.swiper.pagination.bullets.length !== this.state.noOfPages) {
        this.setState({
          noOfPages: this.swiper.pagination.bullets.length
        });
      }
    }
    if (prevProps.children !== this.props.children) {
      if (this.swiper) {
        let isReallyEnd = this.getIsEnd(this.swiper);
        this.setState({
          isEnd: isReallyEnd,
          noOfPages: this.swiper.pagination.bullets.length
        });
        this.swiper.update();
      }
    }
  }

  render() {
    return (
      <div className="desktop-slider">
        {this.setSwiper()}

        {!this.state.isEnd && (
          <div className="swiper-button-next">
            <Icon
              name="chevron_right"
              className="swiper-button-next-icon material-icons"
              onClick={() => {
                if (this.swiper) {
                  this.swiper.slideNext();
                }
              }}
              data-cy="next-btn"
            />
          </div>
        )}
        {!this.state.isBeginning && (
          <div className="swiper-button-prev">
            <Icon
              name="chevron_left"
              className="swiper-button-prev-icon material-icons"
              onClick={() => {
                if (this.swiper) {
                  this.swiper.slidePrev();
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

class Slider extends React.Component {
  render() {
    if (this.props.isKiosk) {
      return (
        <MobileSlider
          initialScrollPos={this.props.initialScrollPos}
          children={this.props.children}
          onSwipe={this.props.onSwipe}
        />
      );
    }

    if (this.props.forceMobile || isMobile) {
      return (
        <MobileSlider
          initialScrollPos={this.props.initialScrollPos}
          children={this.props.children}
          onSwipe={this.props.onSwipe}
        />
      );
    }
    return (
      <DesktopSlider
        initialScrollPos={this.props.initialScrollPos}
        children={this.props.children}
        onSwipe={this.props.onSwipe}
        name={this.props.name}
        isKiosk={this.props.isKiosk}
      />
    );
  }
}

const mapStateToProps = state => ({
  isKiosk: state.kiosk.enabled
});

export default connect(mapStateToProps, {})(Slider);
