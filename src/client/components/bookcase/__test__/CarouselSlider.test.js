import React from 'react';
import renderer from 'react-test-renderer';

import Slider from '../CarouselSlider.component';

describe('Slider', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <Slider slideIndex={0} onNextBook={''}>
          <h1 key="1">test</h1>
          <h1 key="2">test</h1>
        </Slider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
