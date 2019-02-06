const defaultState = {
  language: 'en',
  components: {
    general: {
      readMore: {
        da: 'Læs mere',
        en: 'Read more'
      },
      searchButton: {
        da: 'Søg',
        en: 'Search'
      },
      back: {
        da: 'Tilbage',
        en: 'Back'
      },
      cancel: {
        da: 'Fortryd',
        en: 'Cancel'
      },
      save: {
        da: 'Gem',
        en: 'Save'
      },
      bestil: {
        da: 'Bestil',
        en: 'Order'
      },
      book: {
        da: 'bog',
        en: 'book'
      },
      books: {
        da: 'bøger',
        en: 'books'
      },
      all: {
        da: 'Alle',
        en: 'All'
      },
      by: {
        da: 'Af',
        en: 'By'
      },
      changeImage: {
        da: 'Skift billede',
        en: 'Change image'
      }
    },

    login: {
      loginButton: {
        da: 'Log ind',
        en: 'Log in'
      },
      logoutButton: {
        da: 'Log ud',
        en: 'Log out'
      },
      modalTitle: {
        da: 'Læg i liste',
        en: 'Add to list'
      },
      modalDescription: {
        da: 'Du skal logge ind for at lægge bøger i en liste.',
        en: 'You have to be signed in, before you can add books to a list.'
      },
      modalCreateProfileText: {
        da:
          'Har du ikke en profil? Du kan nemt oprette en profil med det login, du bruger på biblioteket.',
        en: 'No profile? ...'
      },
      modalCreateProfileLink: {
        da: 'Opret en profil',
        en: 'Create profile'
      },
      modalNoContextReason: {
        da: 'Du skal logge ind',
        en: 'You have to log in'
      }
    },

    topbar: {
      betaText: {
        da: 'Nu %s bøger. ',
        en: 'Now %s books. '
      }
    },

    footer: {
      sectionOne: {
        da:
          'Læsekompasset hjælper dig med at opdage bøger, der passer dig, og inspirerer dig til nye læseoplevelser.',
        en:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      sectionTwo: {
        da:
          'Siden er i øjeblikket i beta-version, hvilket betyder, at den stadig er under udvikling og at du kan opleve ting, der ikke fungerer optimalt endnu.',
        en:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      customerServiceText: {
        da: 'Problemer med teknikken?',
        en: 'Problems with the site?'
      },
      customerServiceLinkText: {
        da: 'Skriv til DBCs kundeservice',
        en: 'Write to DBCs customer service'
      },
      writeToManagementText: {
        da: 'Spørgsmål om Læsekompasset?',
        en: 'Questions for Læsekompasset?'
      },
      writeToManagementLinkText: {
        da: 'Skriv til projektledelsen',
        en: 'Write to the management'
      },
      addressCompany: {
        da: 'DBC a/s',
        en: 'DBC a/s'
      },
      addressStreet: {
        da: 'Tempovej 7-11',
        en: 'Tempovej 7-11'
      },
      addressCity: {
        da: '2750 Ballerup',
        en: '2750 Ballerup'
      }
    },

    shortlist: {
      title: {
        da: 'Huskeliste',
        en: 'Shortlist'
      },
      titleWithBooks: {
        da: 'Huskeliste (%s)',
        en: 'Shortlist (%s)'
      },
      origin: {
        da: 'Tilføjet fra huskelisten',
        en: 'Added from the shortlist'
      },
      emptyList: {
        da: 'Din huskeliste er tom',
        en: 'Your shortlist is empty'
      },
      shortlistGo: {
        da: 'Gå til huskeliste',
        en: 'To shortlist'
      },
      shortlistOrder: {
        da: 'Bestil hele listen',
        en: 'Order the entire list'
      },
      shortlistClear: {
        da: 'Ryd listen',
        en: 'Clear list'
      }
    },

    list: {
      listButton: {
        da: 'Lister',
        en: 'Lists'
      },
      addToList: {
        da: 'Tilføj til liste',
        en: 'Add to list'
      },
      addAllToList: {
        da: 'Tilføj alle til liste',
        en: 'Add all to a list'
      },
      editLists: {
        da: 'Redigér lister',
        en: 'Edit lists'
      },
      createNew: {
        da: 'Opret ny liste',
        en: 'Create new list'
      },
      fetchListError: {
        da: 'Listen kunne ikke hentes',
        en: 'Couldn`t view list'
      },
      listNotAvailable: {
        da: 'Listen er slettet',
        en: 'List is no longer availabel'
      },
      placeholderTitle: {
        da: 'Listens titel',
        en: 'Title of the list'
      },
      noTitle: {
        da: 'Listen skal have en titel',
        en: 'The list must have a title'
      },
      placeholderDescription: {
        da: 'Fortæl om listen',
        en: 'Tell about the list'
      },
      addBooksToList: {
        da: 'Vil du tilføje bøger til listen?',
        en: 'Add books to the list?'
      }
    },

    order: {
      orderInProgress: {
        da: 'Bestiller...',
        en: 'Ordering...'
      },
      orderDone: {
        da: 'Bestilt',
        en: 'Ordered'
      },
      orderError: {
        da: 'Fejl ved bestilling',
        en: 'Order error'
      },
      orderAvailability: {
        da: 'Tjekker tilgængelighed',
        en: 'Checking availability'
      },
      orderPossible: {
        da: 'Kan bestilles',
        en: 'Order is possible'
      },
      orderNow: {
        da: 'Ja tak, bestil nu',
        en: 'Yes please, order now'
      },
      booksOrdered: {
        da: '%s %s er bestilt',
        en: '%s %s is ordered'
      },
      booksOrderedText: {
        da: 'Du får besked fra dit bibliotek, når de er klar til afhentning',
        en: ''
      },
      anErrorOccured: {
        da: 'Der skete en fejl så %s af bøgerne ikke er blevet bestilt.',
        en: 'An error occured, %s of the books can`t be ordered'
      },
      anErrorOccuredHelpText: {
        da: 'Du kan evt. prøve at bestille bøgerne igen',
        en: 'You can try to order the books again'
      },
      notYourLibrary: {
        da: 'Kan ikke bestilles til dit bibliotek.',
        en: 'Can`t be ordered to your library'
      },
      modalTitle: {
        da: 'Bestil',
        en: 'Order'
      },
      modalTextCount: {
        da: 'Du er ved at bestille %s %s',
        en: 'You are about to order %s %s'
      },
      modalOrderLimit: {
        da:
          'Du kan højest bestille 10 bøger ad gangen. Klik på "Bestil hele listen" igen for at bestille flere bøger.',
        en:
          'You can only order a maximum of 10 books at a time. Click "Order entire list", again to order more books.'
      },
      modalOrderNotice: {
        da:
          'Bemærk: Der er problemer med bestillingen af mindst en af bøgerne.',
        en:
          'Notice: There is a problem with one og more books in the current order.'
      },
      orderPickup: {
        da: 'Til afhentning på:',
        en: 'For pickup at:'
      },
      loginModalText: {
        da: 'Du skal logge ind for at bestille bøger.',
        en: 'You need to be signed in to order books'
      }
    },

    share: {
      shareOnFacebook: {
        da: 'Del på facebook',
        en: 'share on facebook'
      },
      shareModalTitle: {
        da: 'Din liste skal være offentlig!',
        en: 'Your list is currently private'
      },
      shareModalDescription: {
        da:
          'For at du kan dele din liste, skal listen være offentlig. Vil du ændre din listes status til offentlig?',
        en:
          'Your list needs to be public before you can share it, do you want to change the status of the list to public?'
      },
      makePublicButton: {
        da: 'Gør min liste offentlig',
        en: 'Make my list public'
      }
    }
  }
};

const textReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default textReducer;
