import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';

import './Tabs.css';

const Tabs = ({className = null, children, params, pages, ...props}) => {
  //
  // Default Tabs settings
  //
  const settings = {
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
      clickable: true,
      renderBullet: function(i, className) {
        return `<span class="${className} mr-2">
                  <Text type="body" variant="weight-semibold">
                    ${pages[i]}
                  </Text>
                </span>`;
      }
    },
    ...params
  };

  return (
    <Swiper className={className} {...settings}>
      {children}
    </Swiper>
  );
};

export default Tabs;
