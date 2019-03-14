/* eslint-disable */

const defaultState = {
  heroes: [
    {
      img: 'img/hero/launch.png',
      btnColor: 'pistache',
      btnText: 'Find en bog, der er lige dig',
      btnTextColor: 'petroleum',
      template: 'info',
      disabled: false
    },
    {
      title: 'Hvordan er din næste bog?',
      text: '',
      img: 'img/hero/fantastisk-mystisk-dyster.jpg',
      tags: [5726, 5708, 5680],
      color: 'white',
      btnColor: 'korn',
      btnText: 'vis bøger',
      btnTextColor: 'petroleum',
      template: 'searchbar',
      disabled: false
    },
    {
      title: 'Hvordan er din næste bog?',
      text: '',
      img: 'img/hero/humoristisk-charmerende-overraskende.jpg',
      tags: [5647, 5654, 5674],
      color: 'white',
      btnColor: 'due',
      btnText: 'vis bøger',
      btnTextColor: 'white',
      template: 'searchbar',
      disabled: false
    },
    {
      title: 'Hvordan er din næste bog?',
      text: '',
      img: 'img/hero/uhyggelig-surrealistisk-barsk.jpg',
      tags: [5700, 5732, 5681],
      color: 'white',
      btnColor: 'mine-shaft',
      btnText: 'vis bøger',
      btnTextColor: 'white',
      template: 'searchbar',
      disabled: false
    },
    {
      title: 'Hvordan er din næste bog?',
      text: '',
      img: 'img/hero/varm-romantisk-realistisk.jpg',
      tags: [5642, 5660, 5731],
      color: 'white',
      btnColor: 'fersken',
      btnText: 'vis bøger',
      btnTextColor: 'petroleum',
      template: 'searchbar',
      disabled: false
    }
  ],
  isLoading: false
};

/* eslint-enable */

const heroReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default heroReducer;
