const defaultState = {
  belts: {
    'En god bog': {
      name: 'En god bog',
      isLoading: false,
      onFrontPage: true,
      links: ['En spændende bog', 'En anderledes bog'],
      works: [],
      tags: [100001, 100003, {id: 5672, weight: 10}, 100005],
      scrollPos: 6
    },
    'En spændende bog': {
      name: 'En spændende bog',
      isLoading: false,
      onFrontPage: false,
      links: [],
      tags: [5676, 5632]
    },
    'En anderledes bog': {
      name: 'En anderledes bog',
      isLoading: false,
      onFrontPage: false,
      links: [],
      tags: [5702]
    },
    'Passer med min smag': {
      name: 'Passer med min smag',
      isLoading: false,
      onFrontPage: false,
      links: [],
      works: [],
      tags: []
    },
    'Mennesket og Naturen': {
      name: 'Mennesket og Naturen',
      subtext:
        'Menneskers identitet bliver sat i spil, når de forlader hverdagen og møder naturen.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 5329, weight: 10},
        {id: 3510, weight: 10},
        5734,
        5731,
        5280,
        5277,
        2183,
        2278
      ]
    },
    'Familiens skyggesider': {
      name: 'Familiens skyggesider',
      subtext:
        'Hjemme er ikke altid bedst. Når det ubehagelige og utænkelige folder sig ud inden for hjemmets 4 vægge.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 1672, weight: 10},
        5734,
        {id: 5731, weight: 10},
        5699,
        5721,
        5696,
        5680,
        {id: 5691, weight: 10}
      ]
    },
    'Tankevækkende Sci-fi': {
      name: 'Tankevækkende Sci-fi',
      subtext:
        'Udforskning af filosofiske spørgsmål og anledning til refleksion gennem andre universer - også dem der ligner vores.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 4927, weight: 10}, 5714, 5713]
    },
    'Bibliotekarens ugentlige anbefalinger': {
      name: 'Bibliotekarens ugentlige anbefalinger',
      isLoading: false,
      onFrontPage: true,
      links: [],
      works: [],
      tags: [-2]
    },
    'Krøllede fortællinger': {
      name: 'Krøllede fortællinger',
      subtext:
        'Skarpsindige betragtninger og satiriske vrid på samfundsordnen. Historier der ikke altid lander blidt.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 2683, weight: 10},
        {id: 5614, weight: 10},
        5624,
        // 5653, uncomment when a work is mapped to this tag
        5652,
        // 5711, uncomment when a work is mapped to this tag
        5717
      ]
    },
    Sofahygge: {
      name: 'Sofahygge',
      subtext:
        'Hent teen, tænd stearinlyset og så op med fødderne og på med plaiden.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 5637, weight: 10}, 5654, 5636, 5731, {id: 5611, weight: 10}]
    },
    Tolkiensque: {
      name: 'Tolkiensque',
      subtext:
        'De store eventyr og udfordringer venter i en anden verden, hvor magiske kræfter og overnaturlige væsner prøver hinanden af.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 6131, weight: 10},
        5726,
        5730,
        5704,
        5705,
        {id: 5707, weight: 10},
        5708
      ]
    },
    'Gotisk uhygge': {
      name: 'Gotisk uhygge',
      subtext:
        'Det er koldt, det stormer, hemmelighederne hober sig op, og du har svært ved at adskille virkelighed og mareridt.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        4044,
        {id: 4895, weight: 10},
        5149,
        5680,
        {id: 5700, weight: 10},
        5670,
        5676
      ]
    },
    Lokalkrimi: {
      name: 'Lokalkrimi',
      subtext:
        'Lokalsamfundets furer og revner. Det starter der, hvor tingene begynder at gå skævt og får fatale følger.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        2683,
        {id: 4907, weight: 10},
        {id: 5368, weight: 10},
        5734,
        5731,
        5670,
        5676,
        5691
      ]
    },
    'Historisk romantik': {
      name: 'Historisk romantik',
      subtext:
        'Hensat til en anden tid får de store følelser lov at folde sig ud. Er man uheldig sætter de sociale spilleregler grænser for hjertets begær.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 5028, weight: 10},
        5016,
        {id: 5149, weight: 10},
        4044,
        4074,
        5275,
        5282,
        189,
        {id: 5660, weight: 10},
        5661,
        5671
      ]
    },
    'Vemodige nordmænd': {
      name: 'Vemodige nordmænd',
      subtext:
        'Når du har lyst til at tænke over livet - også det svære og sårbare.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 4466, weight: 10},
        5731,
        3510,
        5626,
        {id: 5683, weight: 10},
        5630
      ]
    }
  }
};

export const ON_BELT_REQUEST = 'ON_BELT_REQUEST';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';
export const ON_TAG_TOGGLE = 'ON_TAG_TOGGLE';
export const ADD_CHILD_BELT = 'ADD_CHILD_BELT';
export const BELT_SCROLL = 'BELT_SCROLL';

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

    case ADD_CHILD_BELT: {
      const {parentBelt, childBelt} = action;
      const belts = traverseBelts(state.belts, b => {
        const belt = {...b};
        if (b === parentBelt) {
          belt.child = childBelt;
        }
        return belt;
      });

      return {belts};
    }

    case BELT_SCROLL: {
      const {belt, scrollPos} = action;
      const belts = traverseBelts(state.belts, b => {
        const copy = {...b};
        if (b === belt) {
          copy.scrollPos = scrollPos;
        }
        return copy;
      });
      return {belts};
    }
    default:
      return state;
  }
};

const traverseBelts = (belts, func) => {
  // depth first traversal of belts
  const processBelt = b => {
    if (b.child) {
      b.child = processBelt(b.child);
    }
    return func(b);
  };
  const newBelts = {};
  Object.values(belts)
    .map(b => processBelt(b))
    .forEach(b => {
      newBelts[b.name] = b;
    });
  return newBelts;
};

export const getBelts = beltState => {
  return Object.values(beltState.belts);
};

export default beltsReducer;
