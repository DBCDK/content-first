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
    this.initialScrollPos = props.initialScrollPos || 0;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.swiper) {
        this.swiper.update();
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
    const {className = null, children, pages, customSettings = {}} = this.props;

    //
    // Merge settings
    //

    const settings = {
      ...defaultSettings,
      pagination: {
        ...defaultSettings.pagination,
        renderBullet: function(i, swiperClass) {
          return `<span class="${swiperClass} mr-4">
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
