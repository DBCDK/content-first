const defaultState = {
  books: [
    {
      pid: '870970-basis:52530423',
      position: {x: 13.5, y: 40},
      description:
        'Lærke vågner efter en hjerneoperation uden minder med en krop fyldt med ar og tatoveringer, som hun ikke kan huske, hvor stammer fra. I sin dagbog har hun streget alt ud om en der hedder Alexander, der står kun: Hold dig væk!. . .'
    },
    {
      pid: '870970-basis:53079202',
      position: {x: 21.8, y: 44},
      description:
        'Da faderen dør, blusser arvestriden op blandt fire søskende og deres mor. Den ene søster, Bergljot, og broderen har brudt med familien på grund af faderens seksuelle overgreb, men resten af familien vil ikke anerkende, hvad der er sket. . .'
    },
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

// export const ON_BOOK_REQUEST = 'ON_BOOK_REQUEST';
// export const ON_BOOK_RESPONSE = 'ON_BOOK_RESPONSE';
export const ON_BOOK_REQUEST_TEST = 'ON_BOOK_REQUEST_TEST';

const bookcaseReducer = (state = defaultState, action) => {
  switch (action.type) {
    // case ON_BOOK_REQUEST: {
    //   const books = state.books.map(b => {
    //     if (b.pid === action.pid) {
    //       return Object.assign({}, b);
    //     }
    //     return b;
    //   });
    //   return Object.assign({}, {books});
    // }
    // case ON_BOOK_RESPONSE: {
    //   const books = state.books.map(b => {
    //     if (b.pid === action.pid) {
    //       return Object.assign({}, b, {work: action.response});
    //     }
    //     return b;
    //   });
    //   return Object.assign({}, {books});
    // }
    case ON_BOOK_REQUEST_TEST: {
      return Object.assign({}, {state});
    }

    default:
      return state;
  }
};

export default bookcaseReducer;
