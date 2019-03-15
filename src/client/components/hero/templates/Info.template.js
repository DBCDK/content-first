import React from 'react';
import {connect} from 'react-redux';
import {Parallax, Background} from 'react-parallax';

import T from '../../base/T';
import Icon from '../../base/Icon';
import Title from '../../base/Title';
import Button from '../../base/Button';

import Explorer from '../explorer/explorer.component.js';

import {startAnimate} from '../../../redux/animate.reducer';

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

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hero);
