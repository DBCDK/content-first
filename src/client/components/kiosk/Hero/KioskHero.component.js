import React from 'react';
import {Parallax} from 'react-parallax';

import './KioskHero.css';

import Title from '../../base/Title';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import scroll from '../../../utils/scroll';
import T from '../../base/T';

import BookSearchSuggester from '../../list/addtolist/BookSearchSuggester';
import withHistory from '../../hoc/AdressBar/withHistory.hoc';

const RoundLabel = () => {
  return (
    <div
      className="RoundLabel waves-effect"
      onClick={() => {
        scroll(0, 1096);
      }}
    >
      <div>Eller få inspiration her</div>
      <Icon name="keyboard_arrow_down" />
    </div>
  );
};

export class KioskHero extends React.Component {
  state = {inputFocused: false};
  render() {
    return (
      <Parallax
        bgImage={'/img/hero/kiosk_background.jpg'}
        strength={300}
        className={`KioskHero ${
          this.state.inputFocused ? 'input-focused' : ''
        }`}
      >
        <div className="search-wrapper">
          <Title type="title1">
            <T component="kioskHero" name="title" />
          </Title>
          <Title type="title2" variant="color-white">
            <T component="kioskHero" name="subtitle" />
          </Title>
          <div className="Search">
            <BookSearchSuggester
              onSubmit={work => {
                this.props.historyPush(`/værk/${work.book.pid}`, {slide: 3});
              }}
              onFocus={() => {
                this.setState({inputFocused: true});
                scroll(0, 0);
              }}
              onBlur={() => {
                this.setState({inputFocused: false});
              }}
              placeholder={T({component: 'kioskHero', name: 'placeholder'})}
              emphasize={false}
            />
            <Button type="primary">
              <T component="kioskHero" name="searchBtn" />
            </Button>
          </div>
        </div>

        <div className="RoundLabelWrapper">
          <RoundLabel />
        </div>
      </Parallax>
    );
  }
}

export default withHistory(KioskHero);
