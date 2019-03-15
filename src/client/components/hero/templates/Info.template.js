import React from 'react';
import {Parallax, Background} from 'react-parallax';

import Explorer from '../explorer/explorer.component.js';

import '../Hero.css';
import './Info.css';

export class Hero extends React.Component {
  render() {
    const {hero, className} = this.props;

    return (
      <Parallax className={className} strength={250}>
        <Background>
          <div
            className={`hero-bg-image box-wrap pistache`}
            style={{backgroundImage: `url(${hero.img})`}}
          />
        </Background>
        <div className="box">{hero.btnText}</div>
        <Explorer />
      </Parallax>
    );
  }
}

export default Hero;
