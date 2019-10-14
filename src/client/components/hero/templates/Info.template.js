import React from 'react';
import {Parallax, Background} from 'react-parallax';

import scroll from '../../../utils/scroll';

import Explorer from '../explorer/explorer.component.js';

import '../Hero.css';
import './Info.css';

/**
* Settings Example:
*
    {
      img: 'img/hero/launch.jpg',
      btnColor: 'pistache',
      btnText: 'Find en bog, der er lige dig',
      btnTextColor: 'petroleum',
      template: 'info',
      disabled: false
    }
*/

export class Hero extends React.Component {
  render() {
    const {hero, state, className} = this.props;

    // Horizontal flip
    const flip = hero.img.flip === 'x' ? 'flipX' : 'flipY';

    // Image source
    const orientation =
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    return (
      <Parallax className={`info-slide ${className}`} strength={250}>
        <Background>
          <div
            className={`hero_bg-image box-wrap ${flip}`}
            style={{
              backgroundImage: `url(${hero.img[orientation]})`,
              backgroundColor: hero.img.blend || 'transparent'
            }}
          />
        </Background>
        <div
          className="box"
          style={{
            backgroundColor: `var(--${hero.btnColor})`,
            color: `var(--${hero.btnTextColor})`
          }}
          onClick={() => {
            if (state.container.clientHeight) {
              scroll(state.container.clientHeight || 0);
            }
          }}
        >
          {hero.btnText}
        </div>
        <Explorer
          scrollDistanceOnClick={
            (state.container && state.container.clientHeight) || 0
          }
        />
      </Parallax>
    );
  }
}

export default Hero;
