import React from 'react';
import renderer from 'react-test-renderer';

import {Bookcase} from '../Bookcase.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../../pulse/Pulse.component', () => 'Pulse');
jest.mock('../../rollover/RollOver.component', () => 'RollOver');

const bookcaseStateOBJ = {
  books: [
    {
      pid: '870970-basis:52038014',
      position: {x: 26, y: 46},
      description:
        'Madeline på 17 lider af en sjælden sygdom, der gør hende allergisk over for alt, og hun har ingen fysisk kontakt med verdenen uden for sit hjem, før en ung mand flytter ind ved siden af, og en kærlighedshistorie vækkes til live. . .'
    },
    {
      pid: '870970-basis:23211629',
      position: {x: 36.5, y: 46},
      description:
        'I en bulet rød Toyota kører Isserly omkring i det skotske højland på udkig efter blaffere: velproportionerede hankønsvæsner. Hvem er denne kvinde, Isserly, med ben som en attenårig og hænder som var hun fyrre? Hvorfor har hun store ar i ansigtet og så enormt tykke brilleglas? Hvad er det med dem, der arbejder på nabogården? Hvorfor er de alle bange for denne Amlis Wess?. . .'
    }
  ]
};

const workStateOBJ = {
  pid: '870970-basis:52530423',
  creator: 'Nicole Boyle Rødtnes',
  title: 'test',
  cover: 'img/cover.png',
  description:
    'Lærke vågner efter en hjerneoperation uden minder med en krop fyldt med ar og tatoveringer, som hun ikke kan huske, hvor stammer fra. I sin dagbog har hun streget alt ud om en der hedder Alexander, der står kun: Hold dig væk!'
};

describe('Bookcase', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <Bookcase bookcaseState={bookcaseStateOBJ} workState={workStateOBJ} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
