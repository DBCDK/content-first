const defaultState = {
  tags: [
    {label: 'Agatha Cristie'},
    {label: 'Mørk'},
    {label: 'Filosofisk'},
    {label: 'Middelalder'},
    {label: 'Charmerende'}
  ],
  recommendations: [
    {pid: '870970-basis:52038014'},
    {pid: '870970-basis:52530423'},
    {pid: '870970-basis:52387078'},
    {pid: '870970-basis:52939321'},
    {pid: '870970-basis:51591046'},
    {pid: '870970-basis:52788226'}
  ]
};

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default profileReducer;
