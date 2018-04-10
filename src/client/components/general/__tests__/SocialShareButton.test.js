import React from 'react';
import renderer from 'react-test-renderer';

import SocialShareButton from '../SocialShareButton.component';

describe('SocialShareButton', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <SocialShareButton
          href={'https://content-first.demo.dbc.dk/lister/1234'}
          hex={'#3b5998'}
          size={40}
          shape="round"
          hoverTitle="Del på facebook"
          stamp="123456789"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
