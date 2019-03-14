import React from 'react';
import {connect} from 'react-redux';
import {Parallax, Background} from 'react-parallax';

import Icon from '../../base/Icon';
import Title from '../../base/Title';
import Button from '../../base/Button';

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
            className={`hero-bg-image box-wrap`}
            style={{backgroundImage: `url(${hero.img})`}}
          >
            <div className="box">{hero.btnText}</div>
          </div>
        </Background>

        <div className="info-callToAction text-center">
          <Title type="title4" variant="color-white">
            Opdag en bog - og lån den på biblioteket
          </Title>
          <Icon className="md-xlarge" name="expand_more" />
        </div>
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
