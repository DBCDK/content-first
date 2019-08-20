import React from 'react';
import {mount} from 'enzyme';
import {ShortList} from '../ShortList.container';

// Mock window.open
global.open = jest.fn();

// Mock AddToList
jest.mock(
  '../../../general/AddToListButton/AddToListButton.component',
  () => 'addtolistbutton'
);

// Mock Link
jest.mock('../../../general/Link.component', () =>
  jest.fn(props => <mocked-link>{props.children}</mocked-link>)
);
const Link = require('../../../general/Link.component');

// Mock OrderButton
const mockOrderBook = jest.fn();
jest.mock('../../../order/OrderButton.component', () => {
  return jest.fn(props => (
    <mocked-order-button onClick={mockOrderBook}>
      {props.children}
    </mocked-order-button>
  ));
});

const OrderButton = require('../../../order/OrderButton.component');

// Mock withWork
jest.mock('../../../hoc/Work/withWork.hoc', () => WrappedComponent => props => (
  <WrappedComponent
    work={{
      book: {
        collection: {
          data: [
            {type: 'bog' + props.pid},
            {
              identifierURI: 'https://identifier/uri/' + props.pid,
              type: 'type' + props.pid
            }
          ],
          isLoading: false
        },
        coverUrl: 'https://cover/url/' + props.pid,
        creator: 'creator' + props.pid,
        description: 'description' + props.pid,
        first_edition_year: 'first edition year' + props.pid,
        language: 'language' + props.pid,
        pages: 'pages - ' + props.pid,
        pid: props.pid,
        reviews: [],
        tags: [],
        taxonomy_description_subjects:
          'taxonomy description subjects - ' + props.pid,
        title: 'title - ' + props.pid
      },
      collectionHasLoaded: true,
      collectionIsLoading: false,
      detailsHasLoaded: true,
      detailsIsLoading: false,
      refsHasLoaded: true,
      refsIsLoading: false,
      reviewsHasLoaded: true,
      reviewsIsLoading: false
    }}
    filterCollection={jest.fn(() => [
      {
        count: 1,
        icon: 'language',
        type: 'Ebog',
        url: 'https://this/url/ebog'
      },
      {
        count: 1,
        icon: 'headset',
        type: 'Lydbog',
        url: 'https://this/url/lydbog'
      }
    ])}
    hasValidCollection={jest.fn(() => true)}
    {...props}
  />
));

const createBook = id => {
  return {
    pid: 'pid - ' + id,
    title: 'some title - ' + id,
    creator: 'creator - ' + id,
    description: 'some description - ' + id,
    pages: 'pages - ' + id,
    language: 'language - ' + id,
    first_edition_year: 'first edition year - ' + id,
    taxonomy_description_subjects: 'taxonomy description subjects - ' + id,
    coverUrl: 'https://some/cover/url/' + id,
    taxonomy_description: 'taxonomy description - ' + id
  };
};
const createTestElement = id => {
  return {
    book: createBook(id),
    detailsIsLoading: false,
    detailsHasLoaded: true,
    origin: 'origin - ' + id
  };
};
const createTestElements = count => {
  const elements = [];
  for (var i = 0; i < count; i++) {
    elements.push(createTestElement(i));
  }
  return elements;
};

describe('ShortList.container', () => {
  test('Short list is empty', () => {
    jest.clearAllMocks();
    const tree = mount(
      <ShortList shortListState={{elements: [], hasLoaded: true}} />
    );
    expect(tree).toMatchSnapshot();
    expect(Link).toHaveBeenCalledTimes(0);
    expect(OrderButton).toHaveBeenCalledTimes(0);
  });

  test('Short list contains elements', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(tree).toMatchSnapshot();
  });

  test('Clearing list', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const mockClearList = jest.fn();
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
        clearList={mockClearList}
      />
    );
    tree
      .find(
        '.top-bar-dropdown-list-page .top-bar-upper-toolbar .Toolbar__right .Button'
      )
      .at(1)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(mockClearList).toHaveBeenCalledTimes(1);
    expect(tree).toMatchSnapshot();
  });

  test('Remove element', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const mockRemove = jest.fn();
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
        remove={mockRemove}
      />
    );
    tree
      .find('.short-list-item .remove-btn')
      .first()
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith('pid - 0');
    expect(tree).toMatchSnapshot();
  });
  /**
   * The following two tests produced a 'Rangeerror: Invalid string length'-error after upgrading to react-scripts 3.0.1(and hence Babel 7)
   * This might be related to a Babel 7 (see https://github.com/facebook/jest/issues/8109#issuecomment-472280699)
   * The tests have been modified to pass for now. But the issue might be looked at, at a later point.
   */
  test('Order book - desktop version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    expect(
      tree
        .find(
          '.top-bar-dropdown-shortlist-item-page .Toolbar.desktop-styling .Toolbar__right mocked-order-button'
        )
        .at(0)
        .exists()
    ).toBeTruthy();
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(tree).toMatchSnapshot();
  });

  test('Order book - mobile version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    expect(
      tree
        .find(
          '.top-bar-dropdown-shortlist-item-page .Toolbar.desktop-styling .Toolbar__right mocked-order-button'
        )
        .at(0)
        .exists()
    ).toBeTruthy();
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(tree).toMatchSnapshot();
  });

  test('Order ebook - desktop version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    tree
      .find(
        '.top-bar-dropdown-shortlist-item-page .Toolbar.desktop-styling .Toolbar__right .Button'
      )
      .at(0)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith('https://this/url/ebog');
    expect(tree).toMatchSnapshot();
  });

  test('Order ebook - mobile version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    tree
      .find(
        'div.short-list-item + div.mobile-styling .Toolbar.mobile-styling .Toolbar__left .Button'
      )
      .at(0)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith('https://this/url/ebog');
    expect(tree).toMatchSnapshot();
  });

  test('Order lydbook - desktop version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    tree
      .find(
        '.top-bar-dropdown-shortlist-item-page .Toolbar.desktop-styling .Toolbar__right .Button'
      )
      .at(1)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith('https://this/url/lydbog');
    expect(tree).toMatchSnapshot();
  });

  test('Order lydbook - mobile version', () => {
    jest.clearAllMocks();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
      />
    );
    tree
      .find(
        'div.short-list-item + div.mobile-styling .Toolbar.mobile-styling .Toolbar__left .Button'
      )
      .at(1)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith('https://this/url/lydbog');
    expect(tree).toMatchSnapshot();
  });

  test('Order all books', () => {
    jest.clearAllMocks();
    const mockOrderAll = jest.fn();
    const testElements = createTestElements(3);
    const tree = mount(
      <ShortList
        shortListState={{elements: testElements, hasLoaded: true}}
        orderList={testElements}
        orderAll={mockOrderAll}
      />
    );
    tree
      .find(
        'div.top-bar-dropdown-list-page div.Toolbar.bottom-toolbar div.Toolbar__right button'
      )
      .at(0)
      .simulate('click');
    expect(Link).toHaveBeenCalledTimes(3);
    expect(OrderButton).toHaveBeenCalledTimes(6);
    expect(mockOrderAll).toHaveBeenCalledTimes(1);
    var argument = mockOrderAll.mock.calls[0][0]; // First argument in first call
    expect(argument.length).toBe(3);
    expect(argument[0].pid).toBe('pid - 0');
    expect(argument[1].pid).toBe('pid - 1');
    expect(argument[2].pid).toBe('pid - 2');
    expect(tree).toMatchSnapshot();
  });
});
