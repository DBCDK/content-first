import React from 'react';
import SlickSlider from 'react-slick';
import Slide from './Slide.component';

const PrevArrow = function(props) {
  return (
    <div
      className={props.className}
      style={props.style}
      onClick={props.onClick}
    >
      <span
        style={{color: '#f04e23', fontSize: 30, lineHeight: 0}}
        className="glyphicon glyphicon-chevron-left"
      />
    </div>
  );
};

const NextArrow = function(props) {
  return (
    <div
      className={props.className}
      style={props.style}
      onClick={props.onClick}
    >
      <span
        style={{color: '#f04e23', fontSize: 30, lineHeight: 0}}
        className="glyphicon glyphicon-chevron-right"
      />
    </div>
  );
};

export default class Slider extends React.Component {
  constructor() {
    super();
    this.state = {isLoadedIndex: 0};
  }
  componentWillReceiveProps() {
    // A fix for initial wrong width calculation
    // https://github.com/akiran/react-slick/issues/809#issuecomment-317277508
    this.refs.slick.innerSlider.onWindowResized();
  }

  render() {
    const settings = {
      dots: true,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToScroll: 4,
      initialSlide: 0,
      rows: 1,
      variableWidth: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      responsive: [
        {
          breakpoint: 1450,
          settings: {
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 769,
          settings: {
            // slidesToShow: 2,
            // slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ],
      afterChange: idx => {
        if (idx > this.state.isLoadedIndex) {
          this.setState({
            isLoadedIndex: idx
          });
        }
      }
    };
    return (
      <SlickSlider ref="slick" {...settings}>
        {this.props.children &&
          this.props.children.map((l, idx) => {
            return (
              <Slide key={l.key}>
                {React.cloneElement(l, {
                  visibleInSlider:
                    idx <
                    this.state.isLoadedIndex + (this.props.loadAheadCount || 7)
                })}
              </Slide>
            );
          })}
      </SlickSlider>
    );
  }
}
