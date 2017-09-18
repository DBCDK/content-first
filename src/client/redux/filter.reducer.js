import {getLeaves} from '../utils/filters';

const defaultState = {
  editFilters: false,
  beltFilters: {
    'En god bog': ['1001', '1003', '49', '1005'],
    'Bibliotekarens ugentlige anbefalinger': [],
    'Passer med min smag': [],
    Spændende: ['50', '230', '267'],
    Anderledes: ['143', '151'],
    'Let læst': ['234', '229'],
    Klog: ['182', '184'],
    Udfordrende: ['239', '236']
  },
  expandedFilters: [],
  filters: [
    {
      id: '0',
      title: 'Vælg stemning',
      children: [
        {
          id: '1',
          title: 'Optimistisk',
          children: [
            {id: '2', title: 'Entusiatisk'},
            {id: '3', title: 'Euforisk'},
            {id: '4', title: 'Glad'},
            {id: '5', title: 'Håbefuld'},
            {id: '6', title: 'Inspirerende'},
            {id: '7', title: 'Opløftende'},
            {id: '8', title: 'Optismistisk'},
            {id: '9', title: 'Respektfuld'},
            {id: '10', title: 'Selvsikker'},
            {id: '11', title: 'Triumfrerende'},
            {id: '12', title: 'Uskyldig'},
            {id: '13', title: 'Fredfuld'}
          ]
        },
        {
          id: '14',
          title: 'Morsom',
          children: [
            {id: '15', title: 'Ironisk'},
            {id: '16', title: 'Komisk'},
            {id: '17', title: 'Latrinær'},
            {id: '18', title: 'Morsom'},
            {id: '19', title: 'Plat'},
            {id: '20', title: 'Sarkastisk'},
            {id: '21', title: 'Satirisk'},
            {id: '22', title: 'Absurd'},
            {id: '23', title: 'Grotesk'},
            {id: '24', title: 'Skælmsk'},
            {id: '25', title: 'Skørt'}
          ]
        },
        {
          id: '26',
          title: 'Charmerende',
          children: [
            {id: '27', title: 'Charmerende'},
            {id: '28', title: 'Elegant'},
            {id: '29', title: 'Engagerende'},
            {id: '30', title: 'Fortryllende'},
            {id: '31', title: 'Frodig'},
            {id: '32', title: 'Fræk'},
            {id: '33', title: 'Nydelsesfuld'},
            {id: '34', title: 'Næsvis'},
            {id: '35', title: 'Rørende'},
            {id: '36', title: 'Sensitiv'},
            {id: '37', title: 'Sexet'},
            {id: '38', title: 'Smuk'},
            {id: '39', title: 'Sympatisk'},
            {id: '40', title: 'Uforglemmelig'},
            {id: '41', title: 'Underholdende'},
            {id: '42', title: 'Øm'}
          ]
        },
        {
          id: '43',
          title: 'Dramatisk',
          children: [
            {id: '44', title: 'Aggressiv'},
            {id: '45', title: 'Bevægende'},
            {id: '46', title: 'Dramatisk'},
            {id: '47', title: 'Emotionel'},
            {id: '48', title: 'Fascinerende'},
            {id: '49', title: 'Medrivende'},
            {id: '50', title: 'Omskiftelig'},
            {id: '51', title: 'Oprivende'},
            {id: '52', title: 'Overraskende'},
            {id: '53', title: 'Sensationel'},
            {id: '54', title: 'Skæbnesvanger'},
            {id: '55', title: 'Spændende'},
            {id: '56', title: 'Spændingsfuld'},
            {id: '57', title: 'Stemningsfuld'},
            {id: '58', title: 'Stridslysten'},
            {id: '59', title: 'Stærk'},
            {id: '60', title: 'Tårepersende'},
            {id: '61', title: 'Vred'}
          ]
        },
        {
          id: '62',
          title: 'Trist',
          children: [
            {id: '63', title: 'Bittersød'},
            {id: '64', title: 'Deprimerende'},
            {id: '65', title: 'Dyster'},
            {id: '66', title: 'Dystopisk'},
            {id: '67', title: 'Grum'},
            {id: '68', title: 'Håbløs'},
            {id: '69', title: 'Melankolsk'},
            {id: '70', title: 'Meningsløs'},
            {id: '71', title: 'Mørk'},
            {id: '72', title: 'Nostalgisk'},
            {id: '73', title: 'Smertefuld'},
            {id: '74', title: 'Sørgelig'},
            {id: '75', title: 'Tragisk'},
            {id: '76', title: 'Trist'},
            {id: '77', title: 'Tung'},
            {id: '78', title: 'Ufrugtbar'},
            {id: '79', title: 'Vemodig'},
            {id: '80', title: 'Øde'},
            {id: '81', title: 'Ødelæggende'}
          ]
        },
        {
          id: '82',
          title: 'Frygtelig',
          children: [
            {id: '83', title: 'Amoralsk'},
            {id: '84', title: 'Angstfyldt'},
            {id: '85', title: 'Blodig'},
            {id: '86', title: 'Enerverende'},
            {id: '87', title: 'Forstyrrende'},
            {id: '88', title: 'Frastødende'},
            {id: '89', title: 'Grufuld'},
            {id: '90', title: 'Gysende'},
            {id: '91', title: 'Hård'},
            {id: '92', title: 'Hårrejsende'},
            {id: '93', title: 'Klaustrofobisk'},
            {id: '94', title: 'Onskabsfuld'},
            {id: '95', title: 'Pervers'},
            {id: '96', title: 'Psykopatisk'},
            {id: '97', title: 'Rædselsfuld'},
            {id: '98', title: 'Skræmmende'},
            {id: '99', title: 'Udpenslet'},
            {id: '100', title: 'Uhyggelig'},
            {id: '101', title: 'Ukomfortabel'},
            {id: '102', title: 'Ulækker'},
            {id: '103', title: 'Voldelig'}
          ]
        },
        {
          id: '104',
          title: 'Realistisk',
          children: [
            {id: '105', title: 'Autentisk'},
            {id: '106', title: 'Dannende'},
            {id: '107', title: 'Detaljeret'},
            {id: '108', title: 'Gribende'},
            {id: '109', title: 'Grov'},
            {id: '110', title: 'Historisk'},
            {id: '111', title: 'Karakterdrevet'},
            {id: '112', title: 'Klar'},
            {id: '113', title: 'Landlig'},
            {id: '114', title: 'Moderne'},
            {id: '115', title: 'Overbevisende'},
            {id: '116', title: 'Prosaisk'},
            {id: '117', title: 'Præcis'},
            {id: '118', title: 'Realistisk'},
            {id: '119', title: 'Sammenhængende'},
            {id: '120', title: 'Urban'},
            {id: '121', title: 'Virkelighedsnært'},
            {id: '122', title: 'Ærlig'}
          ]
        },
        {
          id: '123',
          title: 'Konventionel',
          children: [
            {id: '124', title: 'Barnlig'},
            {id: '125', title: 'En-dimensionel'},
            {id: '126', title: 'Fad'},
            {id: '127', title: 'Familiær'},
            {id: '128', title: 'Flad'},
            {id: '129', title: 'Folkelig'},
            {id: '130', title: 'Formularisk'},
            {id: '131', title: 'Gentagende'},
            {id: '132', title: 'Kliché'},
            {id: '133', title: 'Komfortabel'},
            {id: '134', title: 'Langsom'},
            {id: '135', title: 'Let'},
            {id: '136', title: 'Melodramatisk'},
            {id: '137', title: 'Rørstrømsk'},
            {id: '138', title: 'Stereotyp'},
            {id: '139', title: 'Søvndyssende'},
            {id: '140', title: 'Tryg'}
          ]
        },
        {
          id: '141',
          title: 'Fantasifuld',
          children: [
            {id: '142', title: 'Allegorisk'},
            {id: '143', title: 'Alternativ'},
            {id: '144', title: 'Beskrivende'},
            {id: '145', title: 'Eksotisk'},
            {id: '146', title: 'Eventyrlig'},
            {id: '147', title: 'Excentrisk'},
            {id: '148', title: 'Fantasifuld'},
            {id: '149', title: 'Fantastisk'},
            {id: '150', title: 'Hypnotiserende'},
            {id: '151', title: 'Innovativ'},
            {id: '152', title: 'Kantet'},
            {id: '153', title: 'Kreativ'},
            {id: '154', title: 'Lyrisk'},
            {id: '155', title: 'Magisk'},
            {id: '156', title: 'Mystisk'},
            {id: '157', title: 'Mytisk'},
            {id: '158', title: 'Mærkelig'},
            {id: '159', title: 'Original'},
            {id: '160', title: 'Poetisk'},
            {id: '161', title: 'Skæv'},
            {id: '162', title: 'Stemningsfuld'},
            {id: '163', title: 'Stilfuld'},
            {id: '164', title: 'Surrealistisk'},
            {id: '165', title: 'Unik'},
            {id: '166', title: 'Urealistisk'},
            {id: '167', title: 'Vemodig'}
          ]
        },
        {
          id: '168',
          title: 'Kompleks',
          children: [
            {id: '169', title: 'Fragmenteret'},
            {id: '170', title: 'Kompleks'},
            {id: '171', title: 'Konstrueret'},
            {id: '172', title: 'Kontroversiel'},
            {id: '173', title: 'Labyrintisk'},
            {id: '174', title: 'Nuanceret'},
            {id: '175', title: 'Ordrig'},
            {id: '176', title: 'Psykologisk'},
            {id: '177', title: 'Ramlende'},
            {id: '178', title: 'Subtil'}
          ]
        },
        {
          id: '179',
          title: 'Intellektuel',
          children: [
            {id: '180', title: 'Dybsindig'},
            {id: '181', title: 'Fatalistisk'},
            {id: '182', title: 'Filosofisk'},
            {id: '183', title: 'Formel'},
            {id: '184', title: 'Indsigtsfuld'},
            {id: '185', title: 'Intelligent'},
            {id: '186', title: 'Lakonisk'},
            {id: '187', title: 'Lærd'},
            {id: '188', title: 'Objektiv'},
            {id: '189', title: 'Observerende'},
            {id: '190', title: 'Ophøjet'},
            {id: '191', title: 'Reflekteret'},
            {id: '192', title: 'Ræsonnerende'},
            {id: '193', title: 'Sofistikeret'},
            {id: '194', title: 'Tidsløs'}
          ]
        },
        {
          id: '195',
          title: 'Sanselig',
          children: [
            {id: '196', title: 'Farverig'},
            {id: '197', title: 'Inderlig'},
            {id: '198', title: 'Passioneret'},
            {id: '199', title: 'Sanselig'},
            {id: '200', title: 'Sensuel'},
            {id: '201', title: 'Taktil'}
          ]
        },
        {
          id: '202',
          title: 'Romantisk',
          children: [
            {id: '203', title: 'Romantisk'},
            {id: '204', title: 'Kærlig'},
            {id: '205', title: 'Følelsesfuld'},
            {id: '206', title: 'Lidenskabelig'},
            {id: '207', title: 'Forførende'},
            {id: '208', title: 'Sukkersød'}
          ]
        },
        {
          id: '209',
          title: 'Erotisk',
          children: [
            {id: '210', title: 'Eksplicit'},
            {id: '211', title: 'Erotisk'},
            {id: '212', title: 'Kropslig'},
            {id: '213', title: 'Pornografisk'},
            {id: '214', title: 'Ophidsende'},
            {id: '215', title: 'Kinky'},
            {id: '216', title: 'Pikant'}
          ]
        },
        {
          id: '2090',
          title: 'Andet',
          children: [
            {id: '234', title: 'Ligefrem'},
            {id: '236', title: 'Krævende'},
            {id: '239', title: 'Meget åben for fortolkning'}
          ]
        }
      ]
    },
    {
      title: 'Vælg længde',
      children: [
        {id: '1000', title: 'Kort', custom: true},
        {id: '1001', title: 'Medium længde', custom: true},
        {id: '1002', title: 'Laaaaaaaaaaaaaaaang', custom: true}
      ]
    },
    {
      title: 'Vælg kvalitetsparametre',
      children: [
        {id: '1003', title: 'Er på mange biblioteker', custom: true},
        {id: '1004', title: 'Bibliotekaren anbefaler', custom: true},
        {id: '1005', title: 'Udlånes meget', custom: true}
      ]
    },
    {
      title: 'Vælg tempo',
      children: [
        {id: '227', title: 'Meget dvælende'},
        {id: '228', title: 'Dvælende'},
        {id: '229', title: 'I bevægelse'},
        {id: '230', title: 'Høj fart'},
        {id: '231', title: 'Hæsblæsende'}
      ]
    },
    {
      title: 'Vælg fokus',
      children: [
        {id: '267', title: 'Plot'},
        {id: '266', title: 'Relationer mellem personer'},
        {id: '265', title: 'Karakterernes udvikling'}
      ]
    }
  ],
  sortBy: [
    {id: 'default', title: 'Alfabetisk', selected: true},
    {id: 'linse', title: 'Linse Kesslers smag', selected: false},
    {id: 'anders', title: 'Anders\' smag', selected: false}
  ]
};

export const ON_SORT_OPTION_SELECT = 'ON_SORT_OPTION_SELECT';
export const ON_EDIT_FILTER_TOGGLE = 'ON_EDIT_FILTER_TOGGLE';
export const ON_FILTER_TOGGLE = 'ON_FILTER_TOGGLE';
export const ON_EXPAND_FILTERS_TOGGLE = 'ON_EXPAND_FILTERS_TOGGLE';
export const ON_RESET_FILTERS = 'ON_RESET_FILTERS';

const filterReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_SORT_OPTION_SELECT: {
      const sortBy = state.sortBy.map(option => {
        return Object.assign({}, option, {selected: option.title === action.value});
      });
      return Object.assign({}, state, {sortBy});
    }
    case ON_EDIT_FILTER_TOGGLE:
      return Object.assign({}, state, {editFilters: !state.editFilters});
    case ON_FILTER_TOGGLE: {
      let filterId;
      getLeaves(state.filters).forEach(filter => {
        if (filter === action.filter) {
          filterId = filter.id;
        }
      });
      const beltFilters = Object.assign({}, state.beltFilters);
      if (beltFilters[action.beltName].includes(filterId)) {
        beltFilters[action.beltName] = beltFilters[action.beltName].filter(id => filterId !== id);
      }
      else {
        beltFilters[action.beltName] = [...beltFilters[action.beltName], filterId];
      }
      return Object.assign({}, state, {beltFilters});
    }
    case ON_EXPAND_FILTERS_TOGGLE: {
      let expandedFilters;
      if (state.expandedFilters.includes(action.id)) {
        expandedFilters = state.expandedFilters.filter(id => id !== action.id);
      }
      else {
        expandedFilters = [...state.expandedFilters];
        expandedFilters.push(action.id);
      }
      return Object.assign({}, state, {expandedFilters});
    }
    case ON_RESET_FILTERS: {
      const beltFilters = Object.assign({}, state.beltFilters);
      beltFilters[action.beltName] = defaultState.beltFilters[action.beltName];
      return Object.assign({}, state, {beltFilters});
    }
    default:
      return state;
  }
};

export default filterReducer;
