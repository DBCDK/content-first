import React from 'react';
import SlickSlider from 'react-slick';
import Slide from '../belt/Slide.component';

let profiles = [];

export default class BookcaseSlider extends React.Component {
  componentDidMount() {
    profiles = this.props.profiles;
  }

  componentWillReceiveProps() {
    // A fix for initial wrong width calculation
    // https://github.com/akiran/react-slick/issues/809#issuecomment-317277508
    this.refs.bookcaseslick.innerSlider.onWindowResized();
  }

  component;

  render() {
    const settings = {
      draggable: false,
      swipe: false,
      dots: true,
      arrows: false,
      infinite: true,
      initialSlide: 0,
      speed: 500,
      variableWidth: false,
      dotsClass: 'slick-dots slick-dots-bookcase',
      customPaging: function(i) {
        return (
          <a className="face-dots">
            <img src={profiles[i].image} alt={profiles[i].name} />
          </a>
        );
      }
    };

    return (
      <SlickSlider ref="bookcaseslick" {...settings}>
        {this.props.children &&
          this.props.children.map(l => {
            return (
              <Slide style={{padding: '0  '}} key={l.key}>
                {l}
              </Slide>
            );
          })}
      </SlickSlider>
    );
  }
}
