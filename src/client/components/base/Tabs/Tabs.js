import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';

import './Tabs.css';

//
// Default Tabs settings
//

const defaultSettings = {
  containerModifierClass: 'Tabs__container-',
  slideClass: 'swiper-slide',
  mousewheel: false,
  slidesPerView: 1,
  noSwiping: !isMobile,
  speed: 400,
  loop: false,
  autoplay: false,
  slidesPerGroup: 1,
  effect: 'slide',
  pagination: {
    el: '.Tabs__pagination',
    bulletClass: 'Tabs__pagination-bullet',
    bulletActiveClass: 'Tabs__pagination-bullet-active',
    type: 'bullets',
    clickable: true
  }
};

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {index: props.initialSlide || 0};
  }

  componentDidMount() {
    if (this.props.swiper && this.swiper) {
      this.props.swiper(this.swiper);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      if (this.swiper) {
        const prevHeight = this.swiper.height;
        this.swiper.update();
        if (prevHeight !== this.swiper.height && this.props.onUpdate) {
          this.props.onUpdate();
        }
      }
    }
  }

  init = swiper => {
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('transitionStart', this.onPageChange);
    }
  };

  onPageChange = () => {
    this.setState({
      index: this.swiper.realIndex
    });
    if (this.props.onPageChange) {
      this.props.onPageChange(this.swiper.realIndex);
    }
  };

  render() {
    const {
      className = null,
      children,
      initialSlide = 0,
      pages,
      customSettings = {}
    } = this.props;

    // Swiper containerClass
    const containerClass = {
      containerClass: `swiper-container ${className}`
    };

    //
    // Merge settings
    //

    const settings = {
      ...containerClass,
      ...defaultSettings,
      pagination: {
        ...defaultSettings.pagination,
        renderBullet: function(i, swiperClass) {
          return `<span class="${swiperClass} mr-4" data-cy="${pages[i]}">
                  <Text type="body" variant="weight-semibold">
                    ${pages[i]}
                  </Text>
                </span>`;
        }
      },
      ...customSettings
    };

    return (
      <Swiper
        ref={node => {
          if (node) {
            this.init(node.swiper);
          }
        }}
        initialSlide={initialSlide}
        className={className}
        onPageChange={this.onPageChange}
        {...settings}
      >
        {children}
      </Swiper>
    );
  }
}

export default Tabs;
