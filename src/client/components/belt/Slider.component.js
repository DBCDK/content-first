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
        style={{color: '#f04e23', fontSize: 30}}
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
        style={{color: '#f04e23', fontSize: 30}}
        className="glyphicon glyphicon-chevron-right"
      />
    </div>
  );
};

export default class Slider extends React.Component {
  render() {
    var settings = {
      dots: true,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      initialSlide: 0,
      variableWidth: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      responsive: [
        {
          breakpoint: 1450,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <SlickSlider {...settings}>
        {this.props.children.map(l => {
          return <Slide key={l.key}>{l}</Slide>;
        })}
      </SlickSlider>
    );
  }
}
