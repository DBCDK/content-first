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

class DesktopSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isBeginning: null, isEnd: null};
  }
  init = swiper => {
    if (swiper !== this.swiper) {
      this.swiper = swiper;
      swiper.on('slideChangeTransitionEnd', this.onSwipeEnd);
      this.onSwipeEnd();
    }
  };
  onSwipeEnd = () => {
    this.setState({
      isBeginning: this.swiper.isBeginning,
      isEnd: this.swiper.isEnd
    });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.swiper) {
        this.swiper.update();
        this.onSwipeEnd();
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
          {props.children.map(el => {
            return el;
          })}
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
