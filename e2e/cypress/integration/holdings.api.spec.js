const pid = '870970-basis:53975542';

const holdingsRequest = (path, callback) => {
  cy.request({
    method: 'GET',
    url: path,
    failOnStatusCode: false
  }).then(response => {
    callback(response);
  });
};
const mockIdMapper = res => {
  cy.request('POST', '/v1/test/nock/idmapper', {
    status: 200,
    body: res
  });
};
const mockSolrDocs = docs => {
  cy.request('POST', '/v1/test/nock/holdingssolr', {
    status: 200,
    body: {
      response: {
        numFound: docs.length,
        start: 0,
        maxScore: 6.3818283,
        docs: docs.map(doc =>
          createHoldingsSolrDoc(doc.bibliographicRecordId, doc.status)
        )
      }
    }
  });
};
const createHoldingsSolrDoc = (bibliographicRecordId, status) => {
  return {
    'holdingsitem.note': [''],
    'holdingsitem.branch': 'Hovedbiblioteket',
    'holdingsitem.itemId': ['5219336091', '5219336952'],
    'holdingsitem.status': [status],
    'holdingsitem_dv.status': [status],
    'holdingsitem.issueId': '',
    'holdingsitem.agencyId': 875210,
    'holdingsitem.location': 'some-location',
    'holdingsitem.issueText': '',
    'holdingsitem.department': 'Voksen',
    'holdingsitem.subLocation': 'Skønlitteratur',
    'holdingsitem.collectionId': '870970-53975542',
    'holdingsitem.readyForLoan': [0],
    'rec.bibliographicRecordId': bibliographicRecordId,
    'holdingsitem.accessionDate': '2019-03-07T00:00:00Z',
    'holdingsitem_dv.accessionDate': ['2019-03-07T00:00:00.000Z'],
    'holdingsitem.circulationRule': 'Standard',
    'holdingsitem.expectedDelivery': '2019-11-19T23:00:00Z',
    'holdingsitem.bibliographicRecordId': bibliographicRecordId,
    'holdingsitem.role': ['bibdk', 'danbib'],
    id: '53975542/32!870970-basis-53975542@710100-53975542#8',
    _version_: 1650716686324596700
  };
};

const mockMultiRecordSolrDocs = () => {
  cy.request('POST', '/v1/test/nock/holdingssolr', {
    status: 200,
    body: {
      response: {
        numFound: 3,
        start: 0,
        maxScore: 6.3818283,
        docs: createHoldingsMultiRecordSolrDoc()
      }
    }
  });
};
const createHoldingsMultiRecordSolrDoc = () => [
  {
    'rec.trackingId': [
      '3867f112-a792-46e2-89af-ca498b7d0110',
      '9c404f7b-e942-4004-839a-11c324eecf49'
    ],
    'holdingsitem.note': [''],
    'holdingsitem.branch': 'Hovedbiblioteket',
    'holdingsitem.itemId': ['3814357901', '3814357911'],
    'holdingsitem.status': ['OnLoan'],
    'holdingsitem_dv.status': ['OnLoan'],
    'holdingsitem.issueId': '',
    'holdingsitem.agencyId': 710100,
    'holdingsitem.location': '',
    'holdingsitem.issueText': '',
    'holdingsitem.department': 'Børn',
    'holdingsitem.subLocation': 'Fantasy',
    'holdingsitem.collectionId': '710100-23740478',
    'holdingsitem.readyForLoan': [0],
    'rec.bibliographicRecordId': '23740478',
    'holdingsitem.accessionDate': '2004-12-08T00:00:00Z',
    'holdingsitem_dv.accessionDate': ['2004-12-08T00:00:00.000Z'],
    'holdingsitem.circulationRule': 'Standard',
    'holdingsitem.expectedDelivery': '2019-12-15T23:00:00Z',
    'holdingsitem.bibliographicRecordId': '23740478',
    'holdingsitem.role': ['bibdk', 'danbib'],
    'rec.repositoryId': '870970-basis:23740478',
    fedoraPid: '870970-basis:23740478',
    id: '23740478/32!710100-katalog-23740478@710100-23740478#1',
    _version_: 1650539915574771700
  },
  {
    'rec.trackingId': [
      '6d0b1a28-5ffe-4530-9e78-2baaa22eb1a9',
      '69ff792b-faa0-4589-9dac-baee924b2100'
    ],
    'holdingsitem.note': [''],
    'holdingsitem.branch': 'Hovedbiblioteket',
    'holdingsitem.itemId': ['4892395182'],
    'holdingsitem.status': ['OnShelf'],
    'holdingsitem_dv.status': ['OnShelf'],
    'holdingsitem.issueId': '',
    'holdingsitem.agencyId': 710100,
    'holdingsitem.location': 'Fjernmagasin, skal reserveres',
    'holdingsitem.issueText': '',
    'holdingsitem.department': 'Børn',
    'holdingsitem.subLocation': 'Skønlitteratur',
    'holdingsitem.collectionId': '710100-21812765',
    'holdingsitem.readyForLoan': [1],
    'rec.bibliographicRecordId': '21812765',
    'holdingsitem.accessionDate': '2017-07-15T00:00:00Z',
    'holdingsitem_dv.accessionDate': ['2017-07-15T00:00:00.000Z'],
    'holdingsitem.circulationRule': 'Standard',
    'holdingsitem.expectedDelivery': '2019-11-27T23:00:00Z',
    'holdingsitem.bibliographicRecordId': '21812765',
    'holdingsitem.role': ['bibdk', 'danbib'],
    'rec.repositoryId': '870970-basis:21812765',
    fedoraPid: '870970-basis:21812765',
    id: '21812765/32!710100-katalog-21812765@710100-21812765#2',
    _version_: 1651461287616446500
  },
  {
    'rec.trackingId': [
      '69ff792b-faa0-4589-9dac-baee924b2100',
      'f6f26222-f6b6-463c-934b-fa21854473b7'
    ],
    'holdingsitem.note': [''],
    'holdingsitem.branch': 'Hovedbiblioteket',
    'holdingsitem.itemId': ['3605174816'],
    'holdingsitem.status': ['OnShelf'],
    'holdingsitem_dv.status': ['OnShelf'],
    'holdingsitem.issueId': '',
    'holdingsitem.agencyId': 710100,
    'holdingsitem.location': 'Fjernmagasin, skal reserveres',
    'holdingsitem.issueText': '',
    'holdingsitem.department': 'Børn',
    'holdingsitem.subLocation': 'Skønlitteratur',
    'holdingsitem.collectionId': '710100-21812765',
    'holdingsitem.readyForLoan': [1],
    'rec.bibliographicRecordId': '21812765',
    'holdingsitem.accessionDate': '2001-09-06T00:00:00Z',
    'holdingsitem_dv.accessionDate': ['2001-09-06T00:00:00.000Z'],
    'holdingsitem.circulationRule': 'Standard',
    'holdingsitem.expectedDelivery': '2019-11-27T23:00:00Z',
    'holdingsitem.bibliographicRecordId': '21812765',
    'holdingsitem.role': ['bibdk', 'danbib'],
    'rec.repositoryId': '870970-basis:21812765',
    fedoraPid: '870970-basis:21812765',
    id: '21812765/32!710100-katalog-21812765@710100-21812765#5',
    _version_: 1651461287616446500
  }
];

describe('holdings API', function() {
  beforeEach(function() {
    cy.request('POST', '/v1/test/nock/cleanAll');
  });

  after(function() {
    cy.request('POST', '/v1/test/nock/cleanAll');
  });

  it(`should give HTTP 400 when query params are missing`, function() {
    holdingsRequest('/v1/holdings', response => {
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].detail).to.contain(
        'Insufficient identification of the material'
      );
    });

    holdingsRequest('/v1/holdings?pid=870970-basis:53975542', response => {
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].detail).to.contain(
        'Insufficient identification of the material'
      );
    });
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:53975542&branch=Hovedbiblioteket',
      response => {
        expect(response.status).to.equal(400);
        expect(response.body.errors[0].detail).to.contain(
          'Insufficient identification of the material'
        );
      }
    );
  });

  it(`should give valid onShelf response`, function() {
    mockIdMapper({
      [pid]: ['870970-basis:53975542']
    });
    mockSolrDocs([{bibliographicRecordId: '53975542', status: 'OnShelf'}]);

    holdingsRequest(
      '/v1/holdings?pid=870970-basis:53975542&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.status).to.equal(200);
        expect(response.body[pid][0].onShelf).to.be.true;
        expect(response.body[pid][0].location).to.equal('some-location');
      }
    );
  });

  it(`should give valid response when not onShelf`, function() {
    mockIdMapper({
      [pid]: ['870970-basis:53975542']
    });
    mockSolrDocs([{bibliographicRecordId: '53975542', status: 'OnLoan'}]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:53975542&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.body[pid][0].onShelf).to.be.false;
      }
    );
  });

  it(`should retrieve holdings for all pids in work`, function() {
    mockIdMapper({
      [pid]: [pid, '875210-basis:12345678']
    });
    mockSolrDocs([
      {bibliographicRecordId: '53975542', status: 'OnLoan'},
      {bibliographicRecordId: '12345678', status: 'OnShelf'}
    ]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:53975542&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.body[pid][0].onShelf).to.be.false;
        expect(response.body[pid][1].onShelf).to.be.true;
        expect(response.body[pid][1].bibliographicRecordId).to.equal(
          '12345678'
        );
      }
    );
  });

  it(`should allow for multiple pids in request`, function() {
    const anotherPid = '870970-basis:23456789';
    mockIdMapper({
      [pid]: [pid],
      [anotherPid]: [anotherPid]
    });
    mockSolrDocs([
      {bibliographicRecordId: '53975542', status: 'OnShelf'},
      {bibliographicRecordId: '23456789', status: 'OnLoan'}
    ]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:53975542&pid=870970-basis:23456789&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.body[pid][0].onShelf).to.be.true;
        expect(response.body[anotherPid][0].onShelf).to.be.false;
      }
    );
  });

  it(`multiple solr records should give valid response`, function() {
    mockIdMapper({
      ['870970-basis:21812765']: [
        '870970-basis:21812765',
        '870970-basis:23740478'
      ]
    });
    mockMultiRecordSolrDocs();

    holdingsRequest(
      '/v1/holdings?pid=870970-basis:21812765&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.status).to.equal(200);
        const holding = response.body['870970-basis:21812765'];
        expect(holding.length).to.equal(2);
        expect(holding[0].bibliographicRecordId).to.equal('21812765');
        expect(holding[0].branch).to.equal('Hovedbiblioteket');
        expect(holding[0].department).to.equal('Børn');
        expect(holding[0].location).to.equal('Fjernmagasin, skal reserveres');
        expect(holding[0].subLocation).to.equal('Skønlitteratur');
        expect(holding[0].onShelf).to.be.true;
        expect(holding[0].notForLoan).to.be.false;
        expect(holding[0].onLoan).to.be.false;
        expect(holding[1].bibliographicRecordId).to.equal('23740478');
        expect(holding[1].branch).to.equal('Hovedbiblioteket');
        expect(holding[1].department).to.equal('Børn');
        expect(holding[1].location).to.equal('');
        expect(holding[1].subLocation).to.equal('Fantasy');
        expect(holding[1].onShelf).to.be.false;
        expect(holding[1].notForLoan).to.be.false;
        expect(holding[1].onLoan).to.be.true;
      }
    );
  });
});
