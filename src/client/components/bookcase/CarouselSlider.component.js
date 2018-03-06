import React from 'react';
import SlickSlider from 'react-slick';
import Slide from '../belt/Slide.component';

const PrevArrow = function(props) {
  return (
    <div
      className={props.className}
      style={props.style}
      onClick={props.onClick}
    >
      <span
        style={{color: '#757575', fontSize: 20, lineHeight: 0}}
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
        style={{color: '#757575', fontSize: 20, lineHeight: 0}}
        className="glyphicon glyphicon-chevron-right"
      />
    </div>
  );
};

export default class Slider extends React.Component {
  componentWillReceiveProps() {
    // A fix for initial wrong width calculation
    // https://github.com/akiran/react-slick/issues/809#issuecomment-317277508
    this.refs.slick.innerSlider.onWindowResized();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.slideIndex !== this.props.slideIndex) {
      this.refs.slick.slickGoTo(this.props.slideIndex);
    }
  }

  component;

  render() {
    const settings = {
      draggable: true,
      dots: true,
      arrows: true,
      infinite: true,
      initialSlide: 0,
      speed: 500,
      variableWidth: false,
      prevArrow: <PrevArrow className="slick-prev" />,
      nextArrow: <NextArrow className="slick-next" />,
      dotsClass: 'slick-dots slick-dots-carousel',
      afterChange: ns => {
        this.props.onNextBook(ns);
      }
    };

    return (
      <SlickSlider ref="slick" {...settings}>
        {this.props.children &&
          this.props.children.map(l => {
            return <Slide key={l.key}>{l}</Slide>;
          })}
      </SlickSlider>
    );
  }
}
