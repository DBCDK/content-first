const defaultState = {
  belts: {
    'En god bog': {
      key: 'En god bog',
      name: 'En god bog',
      isLoading: false,
      onFrontPage: false,
      works: [],
      tags: [100001, 100003, {id: 5672, weight: 10}, 100005],
      type: 'belt',
      child: false
    },
    'En spændende bog': {
      key: 'En spændende bog',
      name: 'En spændende bog',
      isLoading: false,
      onFrontPage: false,
      links: [],
      tags: [5676, 5632],
      type: 'belt',
      child: false
    },
    'En anderledes bog': {
      key: 'En anderledes bog',
      name: 'En anderledes bog',
      isLoading: false,
      onFrontPage: false,
      links: [],
      tags: [5702],
      type: 'belt',
      child: false
    },
    'Passer med min smag': {
      key: 'Passer med min smag',
      name: 'Passer med min smag',
      isLoading: false,
      onFrontPage: false,
      links: [],
      works: [],
      tags: [],
      type: 'belt',
      child: false
    },
    'Mennesket og Naturen': {
      key: 'Mennesket og Naturen',
      name: 'Mennesket og Naturen',
      subtext:
        'Menneskers identitet bliver sat i spil, når de forlader hverdagen og møder naturen.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 5329, weight: 10},
        {id: 3510, weight: 10},
        5731,
        5280,
        5277,
        2183,
        2278
      ],
      type: 'belt',
      child: false
    },
    'Familiens skyggesider': {
      key: 'Familiens skyggesider',
      name: 'Familiens skyggesider',
      subtext:
        'Hjemme er ikke altid bedst. Når det ubehagelige og utænkelige folder sig ud inden for hjemmets 4 vægge.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        {id: 1672, weight: 10},
        {id: 5731, weight: 10},
        5699,
        5721,
        5696,
        5680,
        {id: 5691, weight: 10}
      ],
      type: 'belt',
      child: false
    },
    'Tankevækkende fremtidsvisioner': {
      key: 'Tankevækkende Sci-fi',
      name: 'Tankevækkende fremtidsvisioner',
      subtext:
        'Udforskning af filosofiske spørgsmål og anledning til refleksion gennem andre universer - også dem der ligner vores.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 4995, weight: 10}, 4927, 5714, 5713],
      type: 'belt',
      child: false
    },
    'Krøllede fortællinger': {
      key: 'Krøllede fortællinger',
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
      ],
      type: 'belt',
      child: false
    },
    Sofahygge: {
      key: 'Sofahygge',
      name: 'Sofahygge',
      subtext:
        'Hent teen, tænd stearinlyset og så op med fødderne og på med plaiden.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 5637, weight: 10}, 5654, 5636, 5731, {id: 5611, weight: 10}],
      type: 'belt',
      child: false
    },
    Tolkienesque: {
      key: 'Tolkienesque',
      name: 'Tolkienesque',
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
      ],
      type: 'belt',
      child: false
    },
    'Det var en mørk og stormfuld nat': {
      key: 'Det var en mørk og stormfuld nat',
      name: 'Det var en mørk og stormfuld nat',
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
      ],
      type: 'belt',
      child: false
    },
    'Hvad sker der bag hækken?': {
      key: 'Hvad sker der bag hækken?',
      name: 'Hvad sker der bag hækken?',
      subtext:
        'Lokalsamfundets furer og revner. Det starter der, hvor tingene begynder at gå skævt og får fatale følger.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [
        2683,
        {id: 4907, weight: 10},
        {id: 5368, weight: 10},
        5731,
        5670,
        5676,
        5691
      ],
      type: 'belt',
      child: false
    },
    'Historiske romaner': {
      key: 'Historiske romaner',
      name: 'Historiske romaner',
      subtext:
        'Hensat til en anden tid får de store følelser lov at folde sig ud. Er man uheldig sætter de sociale spilleregler grænser for hjertets begær.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 4901, weight: 10}, 5660, 5658, 189],
      type: 'belt',
      child: false
    },
    'Vemodige nordmænd': {
      key: 'Vemodige nordmænd',
      name: 'Vemodige nordmænd',
      subtext:
        'Når du har lyst til at tænke over livet - også det svære og sårbare.',
      isLoading: false,
      onFrontPage: true,
      links: [],
      tags: [{id: 4466, weight: 10}, 5731, 3510, 5626, 5683, 5630],
      type: 'belt',
      child: false
    }
  }
};

export const BELTS_LOAD_REQUEST = 'BELTS_LOAD_REQUEST';
export const BELTS_LOAD_RESPONSE = 'BELTS_LOAD_RESPONSE';
export const STORE_BELT = 'STORE_BELT';
export const UPDATE_BELT = 'UPDATE_BELT';
export const BELT_TITLE_CLICK = 'BELT_TITLE_CLICK';
export const BELT_TAG_CLICK = 'BELT_TAG_CLICK';

export const REMOVE_BELT_REQUEST = 'REMOVE_BELT_REQUEST';
export const REMOVE_BELT_RESPONSE = 'REMOVE_BELT_RESPONSE';

export const TOGGLE_EDIT = 'TOGGLE_EDIT';

export const UPDATE_BELT_DATA = 'UPDATE_BELT_DATA';

export const ON_BELT_REQUEST = 'ON_BELT_REQUEST';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';
export const ADD_BELT = 'ADD_BELT';
export const REMOVE_BELT = 'REMOVE_BELT';
export const ON_TAG_TOGGLE = 'ON_TAG_TOGGLE';
export const ADD_CHILD_BELT = 'ADD_CHILD_BELT';
export const REMOVE_CHILD_BELT = 'REMOVE_CHILD_BELT';
export const BELT_SCROLL = 'BELT_SCROLL';
export const REORGANIZE_FILTERPAGE_BELTS = 'REORGANIZE_FILTERPAGE_BELTS';

/* eslint-disable complexity */
const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BELTS_LOAD_REQUEST: {
      return Object.assign({}, state, {
        loadingBelts: true
      });
    }

    case BELTS_LOAD_RESPONSE: {
      const copy = {...state.belts};
      action.data.forEach(belt => {
        copy[belt.key] = belt;
      });
      return Object.assign(
        {},
        {belts: copy},
        {
          loadingBelts: false
        }
      );
    }

    case STORE_BELT: {
      const belt = action.belt;
      const copy = {...state.belts};

      if (!belt) {
        throw new Error("'belt' is missing from action");
      }

      copy[belt.key] = {...belt};
      return Object.assign({}, {belts: copy});
    }

    case UPDATE_BELT: {
      const belt = action.belt;
      const copy = {...state.belts};

      if (!belt) {
        throw new Error("'belt' is missing from action");
      }

      copy[belt.key] = {...belt, editing: !belt.editing};

      return Object.assign({}, {belts: copy});
    }

    case UPDATE_BELT_DATA: {
      const belt = action.belt;
      const data = action.data;

      if (!data) {
        throw new Error("'data' is missing from action");
      }

      if (!belt) {
        throw new Error("'belt' is missing from action");
      }

      const copy = {...state.belts[belt.key], ...data};

      return Object.assign({}, state, {
        belts: {...state.belts, [belt.key]: copy}
      });
    }

    case REMOVE_BELT_REQUEST: {
      const key = action.belt.key;
      const copy = {...state.belts};
      delete copy[key];
      return Object.assign(
        {},
        {belts: copy},
        {
          loadingBelts: true,
          removingBelt: true
        }
      );
    }

    case REMOVE_BELT_RESPONSE: {
      return Object.assign({}, state, {
        loadingBelts: false,
        removingBelt: false
      });
    }

    case TOGGLE_EDIT: {
      const belt = action.belt;
      const copy = {...state.belts};

      copy[belt.key] = {...belt, editing: !belt.editing};

      return Object.assign({}, {belts: copy});
    }

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

    case ADD_BELT: {
      const newBelt = action.belt;
      const key = action.belt.key || action.belt.name;
      const copy = {...state.belts};

      if (!action.belt[key]) {
        copy[key] = newBelt;
        return Object.assign({}, {belts: copy});
      }
      return state;
    }

    case REMOVE_BELT: {
      const belt = action.belt;
      const key = belt.key || belt.name;
      const copy = {...state.belts};
      if (copy[key]) {
        delete copy[key];
      }
      return Object.assign({}, {belts: copy});
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
        if (b.key === parentBelt.key) {
          belt.child = childBelt;
        }
        return belt;
      });
      return {belts};
    }

    case REMOVE_CHILD_BELT: {
      const {parentBelt} = action;
      const belts = traverseBelts(state.belts, b => {
        const copy = {...b};
        if (b.child && b.child.key === parentBelt.child.key) {
          copy.child = false;
        }
        return copy;
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

    // TODO: This is a quick-and-dirty-fix for the current issue. Grooming is needed for a better solution.
    case REORGANIZE_FILTERPAGE_BELTS: {
      const belts = {};
      Object.keys(state.belts).forEach(key => {
        if (!key.includes('filterpage')) {
          belts[key] = state.belts[key];
        }
      });
      return Object.assign({}, {belts});
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
      newBelts[b.key] = b;
    });
  return newBelts;
};

// Action creators

export const getBelts = beltState => {
  return Object.values(beltState.belts);
};

export const storeBelt = belt => {
  return {
    type: STORE_BELT,
    belt: {
      ...belt,
      _created: Date.now(),
      _type: belt.type
    }
  };
};

export const removeBelt = belt => {
  return {
    type: REMOVE_BELT_REQUEST,
    belt: {
      ...belt
    }
  };
};

// updates belt data in reducer
export const updateBeltData = props => {
  return {
    type: UPDATE_BELT_DATA,
    belt: props.belt,
    data: props.data
  };
};

// updates belt data in db
export const updateBelt = belt => {
  return {
    type: UPDATE_BELT,
    belt
  };
};

export default beltsReducer;
