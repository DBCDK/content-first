import React from 'react';
import Swiper from 'react-id-swiper';
import {isMobile} from 'react-device-detect';

const params = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  slidesPerView: 'auto',
  slidesPerGroup: 3,
  spaceBetween: 30,
  rebuildOnUpdate: true
};

const MobileSlider = props => {
  return (
    <div
      style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {props.children}
    </div>
  );
};

const DesktopSlider = props => {
  return (
    <Swiper {...params}>
      {props.children.map(el => {
        return el;
      })}
    </Swiper>
  );
};

export default class Slider extends React.Component {
  render() {
    if (isMobile) {
      return <MobileSlider children={this.props.children} />;
    }
    return <DesktopSlider children={this.props.children} />;
  }
}
// export default class Slider extends React.Component {
//   constructor() {
//     super();
//     this.state = {isLoadedIndex: 0};
//   }
//   componentWillReceiveProps() {
//     // A fix for initial wrong width calculation
//     // https://github.com/akiran/react-slick/issues/809#issuecomment-317277508
//     this.refs.slick.innerSlider.onWindowResized();
//   }
//
//   render() {
//     const settings = {
//       dots: true,
//       arrows: true,
//       infinite: false,
//       speed: 500,
//       slidesToScroll: 4,
//       slidesToShow: 4,
//       initialSlide: 0,
//       rows: 1,
//       variableWidth: true,
//       prevArrow: <PrevArrow />,
//       nextArrow: <NextArrow />,
//       responsive: [
//         {
//           breakpoint: 1450,
//           settings: {
//             slidesToScroll: 3,
//             slidesToShow: 3
//           }
//         },
//         {
//           breakpoint: 1200,
//           settings: {
//             slidesToScroll: 2,
//             slidesToShow: 2
//           }
//         },
//         {
//           breakpoint: 769,
//           settings: {
//             // slidesToShow: 2,
//             // slidesToScroll: 2
//           }
//         },
//         {
//           breakpoint: 480,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1
//           }
//         }
//       ],
//       afterChange: idx => {
//         if (idx > this.state.isLoadedIndex) {
//           this.setState({
//             isLoadedIndex: idx
//           });
//         }
//       }
//     };
//     return (
//       <SlickSlider ref="slick" {...settings}>
//         {this.props.children &&
//           this.props.children.map((l, idx) => {
//             return (
//               <Slide key={l.key}>
//                 {React.cloneElement(l, {
//                   visibleInSlider:
//                     idx <
//                     this.state.isLoadedIndex + (this.props.loadAheadCount || 7)
//                 })}
//               </Slide>
//             );
//           })}
//       </SlickSlider>
//     );
//   }
// }
