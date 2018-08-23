import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';
import Icon from '../base/Icon';
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
    this.index = props.initialScrollPos || 0;
  }
  componentDidMount() {
    this.slider.scrollLeft =
      this.slider.scrollWidth / this.props.children.length * this.index;
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
  constructor(props) {
    super(props);
    this.initialScrollPos = props.initialScrollPos || 0;
    this.state = {isBeginning: null, isEnd: null};
  }
  init = swiper => {
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('transitionStart', this.onSwipe);
    }
  };

  onSwipe = () => {
    this.setState({
      isBeginning: this.swiper.isBeginning,
      isEnd: this.swiper.isEnd,
      index: this.swiper.realIndex
    });
    if (this.props.onSwipe) {
      this.props.onSwipe(
        this.swiper.isEnd
          ? this.props.children.length - 1
          : this.swiper.realIndex
      );
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.swiper) {
        this.swiper.update();
      }
    }
  }

  render() {
    const props = this.props;
    return (
      <div className="col-12 p-0 desktop-slider">
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
        {!this.state.isEnd && (
          <Icon
            name="chevron_right"
            className="swiper-button-next material-icons"
            onClick={() => {
              if (this.swiper) {
                this.swiper.slideNext();
              }
            }}
          />
        )}
        {!this.state.isBeginning && (
          <Icon
            name="chevron_left"
            className="swiper-button-prev material-icons"
            onClick={() => {
              if (this.swiper) {
                this.swiper.slidePrev();
              }
            }}
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
      />
    );
  }
}
