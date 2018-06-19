import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';
import './Slider.css';

const params = {
  pagination: {
    el: '.swiper-pagination',
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

class MobileSlider extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.props.onSwipe(this.index);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.props.onSwipe(this.index);
    }
  }
  render() {
    return (
      <div
        className="mobile-slider-wrapper"
        onScroll={e => {
          const index = Math.floor(
            e.target.scrollLeft /
              (e.target.scrollWidth / this.props.children.length)
          );
          if (this.index !== index) {
            this.index = index;
            this.props.onSwipe(this.index);
          }
        }}
      >
        <div className="mobile-slider">{this.props.children}</div>
      </div>
    );
  }
}

class DesktopSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isBeginning: null, isEnd: null};
  }
  init = swiper => {
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('slideChangeTransitionStart', this.onSwipe);
      this.onSwipe();
    }
  };
  onSwipe = () => {
    this.setState({
      isBeginning: this.swiper.isBeginning,
      isEnd: this.swiper.isEnd,
      index: this.swiper.realIndex
    });
    this.props.onSwipe(this.swiper.realIndex);
  };
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.swiper) {
        this.swiper.update();
        this.onSwipe();
      }
    }
  }

  render() {
    const props = this.props;
    return (
      <div className="desktop-slider">
        <Swiper
          {...params}
          ref={node => {
            if (node) {
              this.init(node.swiper);
            }
          }}
        >
          {props.children}
        </Swiper>
        {!this.state.isEnd && (
          <span
            onClick={() => {
              if (this.swiper) {
                this.swiper.slideNext();
              }
            }}
            className="swiper-button-next"
          />
        )}
        {!this.state.isBeginning && (
          <span
            onClick={() => {
              if (this.swiper) {
                this.swiper.slidePrev();
              }
            }}
            className="swiper-button-prev"
          />
        )}
      </div>
    );
  }
}

export default class Slider extends React.Component {
  render() {
    if (isMobile) {
      return (
        <MobileSlider
          children={this.props.children}
          onSwipe={this.props.onSwipe}
        />
      );
    }
    return (
      <DesktopSlider
        children={this.props.children}
        onSwipe={this.props.onSwipe}
      />
    );
  }
}
