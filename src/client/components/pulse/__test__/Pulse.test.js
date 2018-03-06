import React from 'react';
import renderer from 'react-test-renderer';
// import {mount} from 'enzyme';

import Pulse from '../Pulse.component';

const pid = '870970-basis:52038014';
const position = {x: 26, y: 46};
const description = 'lorem ipsum . . .';

describe('Pulse', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <Pulse
          onClick={() => {
            this.rollOverTrigger(pid, description, position, 0);
          }}
          delay={2}
          position={position}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  // it('calls onclick prop on click', () => {
  //   const tree = mount(
  //     <Pulse
  //       onClick={() => {
  //         this.rollOverTrigger(pid, description, position, 0);
  //       }}
  //       position={position}
  //     />
  //   );
  //   tree.find('.pulse-toucharea').simulate('click');
  // });
});
