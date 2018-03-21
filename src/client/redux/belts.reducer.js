const defaultState = {
  belts: [
    {
      name: 'En god bog',
      details: 'Detaljer for en god bog',
      isLoading: false,
      onFrontPage: true,
      links: ['En spændende bog', 'En anderledes bog'],
      works: []
    },
    {
      name: 'En spændende bog',
      isLoading: false,
      onFrontPage: false,
      links: []
    },
    {
      name: 'En anderledes bog',
      isLoading: false,
      onFrontPage: false,
      links: []
    },
    {
      name: 'Passer med min smag',
      isLoading: false,
      onFrontPage: false,
      links: [],
      works: []
    },
    {
      name: 'Mennesket og Naturen',
      subtext:
        'Menneskers identitet bliver sat i spil, når de forlader hverdagen og møder naturen.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Familiens skyggesider',
      subtext:
        'Hjemme er ikke altid bedst. Når det ubehagelige og utænkelige folder sig ud inden for hjemmets 4 vægge.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Tankevækkende Sci-fi',
      subtext:
        'Udforskning af filosofiske spørgsmål og anledning til refleksion gennem andre universer - også dem der ligner vores.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Bibliotekarens ugentlige anbefalinger',
      details: 'Detaljer for ugentlige anbefalinger',
      isLoading: false,
      onFrontPage: true,
      links: [],
      works: []
    },
    {
      name: 'Krøllede fortællinger',
      subtext:
        'Skarpsindige betragtninger og satiriske vrid på samfundsordnen. Historier der ikke altid lander blidt.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Sofahygge',
      subtext:
        'Hent teen, tænd stearinlyset og så op med fødderne og på med plaiden.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Tolkiensque',
      subtext:
        'De store eventyr og udfordringer venter i en anden verden, hvor magiske kræfter og overnaturlige væsner prøver hinanden af.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Gotisk uhygge',
      subtext:
        'Det er koldt, det stormer, hemmelighederne hober sig op, og du har svært ved at adskille virkelighed og mareridt.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Lokalkrimi',
      subtext:
        'Lokalsamfundets furer og revner. Det starter der, hvor tingene begynder at gå skævt og får fatale følger.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Historisk romantik',
      subtext:
        'Hensat til en anden tid får de store følelser lov at folde sig ud. Er man uheldig sætter de sociale spilleregler grænser for hjertets begær.',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Vemodige nordmænd',
      subtext:
        'Når du har lyst til at tænke over livet - også det svære og sårbare.',
      isLoading: false,
      onFrontPage: true,
      links: []
    }
  ]
};

export const ON_BELT_REQUEST = 'ON_BELT_REQUEST';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';
export const ON_TAG_TOGGLE = 'ON_TAG_TOGGLE';

const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BELT_REQUEST: {
      const belts = state.belts.map(belt => {
        if (belt.name === action.beltName) {
          return Object.assign({}, belt, {isLoading: true});
        }
        return belt;
      });
      return Object.assign({}, {belts});
    }

    case ON_BELT_RESPONSE: {
      const belts = state.belts.map(belt => {
        if (belt.name === action.beltName) {
          return Object.assign(
            {},
            belt,
            {isLoading: false},
            {works: action.response}
          );
        }
        return belt;
      });
      return Object.assign({}, {belts});
    }

    case ON_TAG_TOGGLE: {
      const belts = [...state.belts];
      const belt = Object.assign({}, belts[action.beltId]);
      belts[action.beltId] = belt;
      belt.tags = [...belt.tags];
      belt.tags[action.tagId] = {
        name: belt.tags[action.tagId].name,
        selected: belt.tags[action.tagId].selected === false
      };
      return Object.assign({}, {belts});
    }

    default:
      return state;
  }
};

export default beltsReducer;
