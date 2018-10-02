import React from 'react';
import renderer from 'react-test-renderer';

import {BookcaseItem} from '../BookcaseItem.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../../pulse/Pulse.component', () => 'Pulse');
jest.mock('../../work/ConciseWork.container', () => 'ConciseWork');
jest.mock('../CarouselItem.component', () => 'CarouselItem');
jest.mock('../CarouselSlider.component', () => 'CarouselSlider');

const list = {
  type: 'CUSTOM_LIST',
  title: 'Test: mytest title"',
  description: 'lorem ipsum',
  isNew: false,
  list: [
    {
      links: {
        self: '/v1/book/870970-basis:54167830',
        cover: '/v1/image/870970-basis:54167830'
      },
      pid: '870970-basis:54167830',
      position: {x: 20.69751928288513, y: 76.62014791898292},
      detailsIsLoading: false,
      detailsHasLoaded: true,
      coverIsLoading: false,
      coverHasLoaded: true,
      tagsIsLoading: false,
      tagsHasLoaded: true,
      refsIsLoading: false,
      refsHasLoaded: true,
      reviewsIsLoading: false,
      reviewsHasLoaded: true,
      collectionIsLoading: false,
      collectionHasLoaded: true,
      _id: '899386b0-c0c4-11e8-bdd4-abc4ee98398d',
      _rev: '1538467889428-fx1imp32i1',
      _owner: 'n9+yn07AkhZImPt7Ou6FIJX8OS41db8b',
      _type: 'list-entry',
      _key: '1c3e2840-bc19-11e8-8186-ad1a5179e67a',
      _public: false,
      _created: 1537881098,
      _modified: 1538467889,
      book: {
        pid: '870970-basis:54167830',
        tags: [
          {
            id: 4961,
            title: 'den 2. verdenskrig',
            sort: 1,
            parents: ['ramme', 'Handlingens tid i ord']
          }
        ],
        collection: {
          data: [
            {
              type: ['Bog']
            },
            {
              type: ['Ebog']
            },
            {
              type: ['Lydbog (cd-mp3)']
            }
          ],
          isLoading: false
        },
        unit_id: '',
        work_id: 'work:27709761',
        bibliographic_record_id: -1,
        creator: 'Martha Hall Kelly',
        title: 'Blomstrende syrener',
        title_full: 'Blomstrende syrener : roman',
        pages: 514,
        type: 'Bog',
        work_type: 'book',
        language: 'Dansk',
        items: 566,
        libraries: 96,
        subject:
          'den 2. verdenskrig, koncentrationslejre, kvinder, medicinske forsøg',
        genre: 'Skønlitteratur',
        first_edition_year: 2018,
        literary_form: '',
        taxonomy_description:
          'Tankevækkende, bevægende og oplysende\nRoman med handling på flere niveauer',
        description:
          'Tre kvinder oplever grusomme ting under 2. verdenskrig. elgørende organisationer bringer nogle af "forsøgskaninerne" til USA i 1950\'erne',
        loans: 0,
        coverUrl:
          'https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54167830&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=3b5d7a06f8b75c49bf42'
      }
    }
  ],
  pending: null,
  owner: 'n9+yn07AkhZImPt7Ou6FIJX8OS41db8b',
  isLoading: false,
  editing: false,
  imageIsLoading: false,
  imageError: null,
  image: '77b1d110-de77-4c23-bcf0-af30988aac33',
  template: 'bookcase',
  public: false,
  social: false,
  open: false,
  heading: 'Test heading"',
  subheading: 'Test subHeading',
  subtitle: "Test subtitle'",
  lead: 'Test lead',
  urlText: 'url text test',
  dotColor: 'due',
  _id: '1c3e2840-bc19-11e8-8186-ad1a5179e67a',
  _rev: '1538467889449-yvvjg9ymw0g',
  _owner: 'n9+yn07AkhZImPt7Ou6FIJX8OS41db8b',
  _type: 'list',
  _key: '',
  _public: false,
  _created: 1537367666,
  _modified: 1538467889
};

describe('BookcaseItem', () => {
  it('loadList is called at mount time', () => {
    let loadListIsCalled = false;
    renderer.create(
      <BookcaseItem
        id={list._id}
        loadList={() => {
          loadListIsCalled = true;
        }}
      />
    );
    expect(loadListIsCalled).toBe(true);
  });

  it('Render list as bookcaseItem', () => {
    const tree = renderer
      .create(<BookcaseItem id={list._id} list={list} loadList={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
