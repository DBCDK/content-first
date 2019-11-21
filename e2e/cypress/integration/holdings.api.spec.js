const pid = '870970-basis:54072813';

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
    'holdingsitem.agencyId': 710100,
    'holdingsitem.location': 'some-location',
    'holdingsitem.issueText': '',
    'holdingsitem.department': 'Voksen',
    'holdingsitem.subLocation': 'Skønlitteratur',
    'holdingsitem.collectionId': '710100-54072813',
    'holdingsitem.readyForLoan': [0],
    'rec.bibliographicRecordId': bibliographicRecordId,
    'holdingsitem.accessionDate': '2019-03-07T00:00:00Z',
    'holdingsitem_dv.accessionDate': ['2019-03-07T00:00:00.000Z'],
    'holdingsitem.circulationRule': 'Standard',
    'holdingsitem.expectedDelivery': '2019-11-19T23:00:00Z',
    'holdingsitem.bibliographicRecordId': bibliographicRecordId,
    'holdingsitem.role': ['bibdk', 'danbib'],
    id: '54072813/32!870970-basis-54072813@710100-54072813#8',
    _version_: 1650716686324596700
  };
};

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

    holdingsRequest('/v1/holdings?pid=870970-basis:54072813', response => {
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].detail).to.contain(
        'Insufficient identification of the material'
      );
    });
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:54072813&branch=Hovedbiblioteket',
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
      [pid]: ['875210-katalog:54072813']
    });
    mockSolrDocs([{bibliographicRecordId: '54072813', status: 'OnShelf'}]);

    holdingsRequest(
      '/v1/holdings?pid=870970-basis:54072813&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.status).to.equal(200);
        expect(response.body[pid][0].onShelf).to.be.true;
        expect(response.body[pid][0].location).to.equal('some-location');
      }
    );
  });

  it(`should give valid response when not onShelf`, function() {
    mockIdMapper({
      [pid]: ['875210-katalog:54072813']
    });
    mockSolrDocs([{bibliographicRecordId: '54072813', status: 'OnLoan'}]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:54072813&branch=Hovedbiblioteket&agencyId=710100',
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
      {bibliographicRecordId: '54072813', status: 'OnLoan'},
      {bibliographicRecordId: '12345678', status: 'OnShelf'}
    ]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:54072813&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.body[pid][0].onShelf).to.be.false;
        expect(response.body[pid][1].onShelf).to.be.true;
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
      {bibliographicRecordId: '54072813', status: 'OnShelf'},
      {bibliographicRecordId: '23456789', status: 'OnLoan'}
    ]);
    holdingsRequest(
      '/v1/holdings?pid=870970-basis:54072813&pid=870970-basis:23456789&branch=Hovedbiblioteket&agencyId=710100',
      response => {
        expect(response.body[pid][0].onShelf).to.be.true;
        expect(response.body[anotherPid][0].onShelf).to.be.false;
      }
    );
  });
});
