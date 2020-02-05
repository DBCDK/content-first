export const ORDER_CONTEXT = {
  name: 'OrderButton',
  modals: {
    login: {
      context: {
        title: 'Bestil bøger'
      }
    },
    premium: {
      context: {
        title: 'Bestil bøger',
        reason: 'Bestilling af bøger er ikke tilgængeligt for dit bibliotek',
        hideConfirm: true
      }
    }
  }
};
