import React from 'react';
import './KioskHero.css';

import Title from '../base/Title';
import Button from '../base/Button';
import Icon from '../base/Icon';
import scroll from '../../utils/scroll';
import T from '../base/T';

import BookSearchSuggester from '../list/addtolist/BookSearchSuggester';

const RoundLabel = () => {
  return (
    <div
      className="RoundLabel"
      onClick={() => {
        scroll(1096);
      }}
    >
      <div>Eller få inspiration her</div>
      <Icon name="keyboard_arrow_down" />
    </div>
  );
};

export default class KioskHero extends React.Component {
  state = {inputFocused: false};
  render() {
    return (
      <div
        className={`KioskHero ${
          this.state.inputFocused ? 'input-focused' : ''
        }`}
      >
        <Title type="title1">
          <T component="kioskHero" name="title" />
        </Title>
        <Title type="title2" variant="color-white">
          <T component="kioskHero" name="subtitle" />
        </Title>
        <div className="Search">
          <BookSearchSuggester
            onSubmit={() => {}}
            onFocus={() => {
              this.setState({inputFocused: true});
              scroll(0);
            }}
            onBlur={() => {
              this.setState({inputFocused: false});
            }}
            placeholder={T({component: 'kioskHero', name: 'placeholder'})}
          />
          <Button type="primary">
            <T component="kioskHero" name="searchBtn" />
          </Button>
        </div>
        <div className="RoundLabelWrapper">
          <RoundLabel />
        </div>
      </div>
    );
  }
}
