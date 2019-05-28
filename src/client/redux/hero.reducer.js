/* eslint-disable */

const defaultState = {
  heroes: [
    {
      img: {
        landscape: 'img/hero/Læsekompas_Images_16x9_023.jpg',
        portrait: 'img/hero/Læsekompas_Images_1500x1500_023.jpg',
        blend: '#b17642',
        flip: false
      },
      btnColor: 'korn',
      btnText: 'Find en bog, der er lige dig',
      btnTextColor: 'petroleum',
      template: 'Info',
      disabled: false
    },
    {
      img: {
        landscape: 'img/hero/Læsekompas_Images_16x9_022.jpg',
        portrait: 'img/hero/Læsekompas_Images_1500x1500_022.jpg',
        blend: '#74a9ff',
        flip: 'x'
      },
      tags: [5642, 5660, 5731],
      btnColor: 'korn',
      btnText: 'Vis bøger',
      btnTextColor: 'petroleum',
      position: 'right',
      template: 'InteractionSlide',
      disabled: false
    },
    {
      img: {
        landscape: 'img/hero/Læsekompas_Images_16x9_024.jpg',
        portrait: 'img/hero/Læsekompas_Images_1500x1500_024.jpg',
        blend: '#f37362',
        flip: false
      },
      tags: [5647, 5654, 5674],
      btnColor: 'korn',
      btnText: 'Vis bøger',
      btnTextColor: 'petroleum',
      position: 'left',
      template: 'InteractionSlide',
      disabled: false
    },
    {
      img: {
        landscape: 'img/hero/Læsekompas_Images_16x9_02.jpg',
        portrait: 'img/hero/Læsekompas_Images_1500x1500_02.jpg',
        blend: '#a8c7b0',
        flip: false
      },
      tags: [5726, 5708, 5680],
      btnColor: 'korn',
      btnText: 'Vis bøger',
      btnTextColor: 'petroleum',
      position: 'left',
      template: 'InteractionSlide',
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
