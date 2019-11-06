const data = {
  frontpage: {
    visit: '/',
    title: 'Læsekompas',
    description:
      'På Læsekompasset kan du gå på opdagelse i skønlitteraturen, få personlige anbefalinger og dele dine oplevelser med andre.',
    canonical: '',
    robots: 'all',
    type: 'website',
    image: {
      url: 'https://laesekompas.dk/img/open-graph/hero-01.jpg',
      width: '1200',
      height: '675'
    }
  },
  filterpage: {
    visit: '/find',
    title: 'Find din næste bog',
    description:
      'Find den helt rigtige bog ved at søge på læseoplevelser som stemning, tempo, skrivestil, sprog.',
    canonical: '/find',
    robots: 'all',
    type: 'book',
    image: {
      url: 'https://laesekompas.dk/img/open-graph/hero-01.jpg',
      width: '1200',
      height: '675'
    }
  },
  shortList: {
    visit: '/huskeliste',
    title: 'Huskeliste',
    description:
      'Gem bøger på din huskeliste mens du går på opdagelse. Så kan du nemmere vælge en bog, der giver dig den helt rigtige læseoplevelse.',
    canonical: '/huskeliste',
    robots: 'all',
    type: 'website',
    image: {
      url: 'https://laesekompas.dk/img/open-graph/hero-01.jpg',
      width: '1200',
      height: '675'
    }
  },
  workpage: {
    visit: '/værk/870970-basis:25775481',
    title: 'Doppler af Erlend Loe',
    description:
      'Doppler, som er en velfungerende borger, beslutter pludselig, at han må finde sig selv, opgiver job og ægteskab og flytter ud i skoven omkring Oslo for at finde sig selv, i selskab med en elgkalv og i pagt med naturen, mens han tænker over udviklingen i samfundet og hans eget ægteskab',
    canonical: '/værk/870970-basis:25775481',
    robots: 'all',
    type: 'book',
    image: {
      url:
        'https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020',
      width: '300',
      height: '600'
    }
  },
  about: {
    visit: '/om',
    title: 'Om',
    description:
      'Læsekompasset er bibliotekernes online inspirationsværktøj til dig. Brug det til at finde ny læsning ud fra den læseoplevelse du er i humør til og lån bøgerne på biblioteket.',
    canonical: '/om',
    robots: 'all',
    type: 'website',
    image: {
      url: 'https://laesekompas.dk/img/open-graph/hero-01.jpg',
      width: '1200',
      height: '675'
    }
  }
};

describe('Head test', function() {
  // List page test
  it(`Check metadata on listpage`, function() {
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser('listowner');

    cy.request('POST', '/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'My new awesome list',
      image: 'list-image.jpg',
      description: 'The description of my new awesome list',
      list: [],
      _type: 'list'
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.get('title').contains('My new awesome list');
      cy.get('meta[name="description"]').should(
        'have.attr',
        'content',
        'The description of my new awesome list'
      );
      // cy.get('link[rel="canonical"]').should(
      //   'have.attr',
      //   'href',
      //   `https://laesekompas.dk/lister/${id}`
      // );
      cy.get('meta[name="robots"]').should('have.attr', 'content', 'all');
      cy.get('meta[property="og:url"]').should(
        'have.attr',
        'content',
        `https://laesekompas.dk/lister/${id}`
      );
      cy.get('meta[name="og:title"]').should(
        'have.attr',
        'content',
        'My new awesome list'
      );
      cy.get('meta[name="og:description"]').should(
        'have.attr',
        'content',
        'The description of my new awesome list'
      );
      cy.get('meta[property="og:type"]').should(
        'have.attr',
        'content',
        'website'
      );
      cy.get('meta[property="og:image"]').should(
        'have.attr',
        'content',
        'https://laesekompas.dk/v1/image/list-image.jpg/1200/600'
      );
      cy.get('meta[property="og:image:width"]').should(
        'have.attr',
        'content',
        '1200'
      );
      cy.get('meta[property="og:image:height"]').should(
        'have.attr',
        'content',
        '600'
      );
    });
  });

  // Other pages
  for (const [key, value] of Object.entries(data)) {
    it(`Check metadata on ${key}`, function() {
      cy.visit(value.visit);

      cy.get('title').contains(value.title);
      cy.get('meta[name="description"]').should(
        'have.attr',
        'content',
        value.description
      );
      // cy.get('link[rel="canonical"]').should(
      //   'have.attr',
      //   'href',
      //   `https://laesekompas.dk${value.canonical}`
      // );
      cy.get('meta[name="robots"]').should(
        'have.attr',
        'content',
        value.robots
      );
      cy.get('meta[property="og:url"]').should(
        'have.attr',
        'content',
        `https://laesekompas.dk${value.canonical}`
      );

      // OpenGraph
      cy.get('meta[name="og:title"]').should(
        'have.attr',
        'content',
        value.title
      );
      cy.get('meta[name="og:description"]').should(
        'have.attr',
        'content',
        value.description
      );
      cy.get('meta[property="og:type"]').should(
        'have.attr',
        'content',
        value.type
      );
      cy.get('meta[property="og:image"]')
        .should('have.attr', 'content')
        .and('contain', value.image.url);
      cy.get('meta[property="og:image:width"]').should(
        'have.attr',
        'content',
        value.image.width
      );
      cy.get('meta[property="og:image:height"]').should(
        'have.attr',
        'content',
        value.image.height
      );
    });
  }
});
