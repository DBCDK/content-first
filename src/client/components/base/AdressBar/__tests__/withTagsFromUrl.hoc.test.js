import React from 'react';
import renderer from 'react-test-renderer';

import {tagsFromURL, toggleTag} from '../withTagsFromUrl.hoc';

describe('withTagsFromUrl.hoc', () => {
  it('expands single tag', () => {
    expect(tagsFromURL('test')).toMatchSnapshot();
  });
  it('expands multiple tags', () => {
    expect(tagsFromURL(['test1', 'test2'])).toMatchSnapshot();
  });
  it('expands a tag as a TAG', () => {
    expect(tagsFromURL(['5643'])).toMatchSnapshot();
  });
  it('expands a pid as a TITLE', () => {
    expect(tagsFromURL(['870970-basis:123456'])).toMatchSnapshot();
  });
  it('expands an author as a QUERY', () => {
    expect(tagsFromURL(['Peter Hansen'])).toMatchSnapshot();
  });
  it('expands multiple tags of different kinds', () => {
    expect(
      tagsFromURL(['Peter Hansen', '870970-basis:123456', '5643'])
    ).toMatchSnapshot();
  });

  it('removes the tag when it is already selected', () => {
    const expandedTags = tagsFromURL([
      'Peter Hansen',
      '870970-basis:123456',
      '5643'
    ]);
    expect(toggleTag(expandedTags, '870970-basis:123456')).toMatchSnapshot();
  });
  it('appends a tag when it is not already selected', () => {
    const expandedTags = tagsFromURL([
      'Peter Hansen',
      '870970-basis:123456',
      '5643'
    ]);
    expect(toggleTag(expandedTags, 'Hest')).toMatchSnapshot();
  });
});
