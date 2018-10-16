/* eslint-disable */

const defaultState = {
  heroes: [
    {
      title: 'Hvordan er din næste bog?',
      text: 'Det kunne måske være en dramatisk, historisk roman',
      img: 'img/hero/test.jpg',
      tags: [5670, 5665, 5028],
      color: 'white',
      btnColor: 'fersken',
      btnText: 'vis bøger'
    },
    {
      title: 'Hvordan er din næste bog?',
      text: 'Hvornår har du sidst læst en uhyggelig krimi',
      img: 'img/hero/krimi.jpg',
      tags: [5690, 5675, 5700],
      color: 'white',
      btnColor: 'fersken',
      btnText: 'vis bøger'
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
