export const ORDER_CONTEXT = {
  name: 'OrderButton',
  modals: {
    login: {
      context: {
        title: 'BESTILLING AF BØGER'
      }
    },
    premium: {
      context: {
        title: 'BESTILLING AF BØGER',
        reason:
          'Dit bibliotek abonnerer ikke på Læsekompas.dk, og du har derfor ikke adgang til bestilling af bøger til biblioteket.',
        hideConfirm: true
      }
    }
  }
};
