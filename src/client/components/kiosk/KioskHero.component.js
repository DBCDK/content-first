import React from 'react';
import './KioskHero.css';

import Title from '../base/Title';
import Button from '../base/Button';
import Icon from '../base/Icon';

import BookSearchSuggester from '../list/addtolist/BookSearchSuggester';

const RoundLabel = () => {
  return (
    <div className="RoundLabel">
      <div>Eller få inspiration her</div>
      <Icon name="keyboard_arrow_down" />
    </div>
  );
};

export default () => (
  <div className="KioskHero">
    <Title type="title1">Find din næste roman</Title>
    <Title type="title2" variant="color-white">
      Start med en god bog du har læst
    </Title>
    <div className="Search">
      <BookSearchSuggester
        // suggesterRef={suggesterRef}
        className="ml-3 mr-5"
        // list={list}
        onSubmit={e => {
          console.log(e);
        }}
      />
      <Button type="primary">Søg</Button>
    </div>
    <div className="RoundLabelWrapper">
      <RoundLabel />
    </div>
  </div>
);
