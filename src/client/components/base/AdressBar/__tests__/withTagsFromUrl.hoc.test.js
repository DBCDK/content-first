import React from 'react';
import renderer from 'react-test-renderer';

import {tagsFromURL, toggleTag} from '../withTagsFromUrl.hoc';
const filtercards = {
  Tempo: {
    title: 'Tempo',
    image: 'img/filters/speed.jpg',
    template: 'CardRange',
    icon: 'signal_cellular_4_bar',
    range: [5629, 5630, 5631, 5632, 5633],
    closeOnSelect: false,
    expanded: false,
    show: true
  }
};

describe('withTagsFromUrl.hoc', () => {
  it('expands single tag', () => {
    expect(tagsFromURL('test', filtercards)).toMatchSnapshot();
  });
  it('expands multiple tags', () => {
    expect(tagsFromURL(['test1', 'test2'], filtercards)).toMatchSnapshot();
  });
  it('expands a tag as a TAG', () => {
    expect(tagsFromURL(['5643'], filtercards)).toMatchSnapshot();
  });
  it('expands a tag range', () => {
    expect(tagsFromURL(['5629:5631'], filtercards)).toMatchSnapshot();
  });
  it('expands a pid as a TITLE', () => {
    expect(tagsFromURL(['870970-basis:123456'], filtercards)).toMatchSnapshot();
  });
  it('expands an author as a QUERY', () => {
    expect(tagsFromURL(['Peter Hansen'], filtercards)).toMatchSnapshot();
  });
  it('expands multiple tags of different kinds', () => {
    expect(
      tagsFromURL(['Peter Hansen', '870970-basis:123456', '5643'], filtercards)
    ).toMatchSnapshot();
  });

  it('removes the tag when it is already selected', () => {
    const expandedTags = tagsFromURL(
      ['Peter Hansen', '870970-basis:123456', '5643'],
      filtercards
    );
    expect(
      toggleTag(expandedTags, filtercards, '870970-basis:123456')
    ).toMatchSnapshot();
  });
  it('appends a tag when it is not already selected', () => {
    const expandedTags = tagsFromURL(
      ['Peter Hansen', '870970-basis:123456', '5643'],
      filtercards
    );
    expect(toggleTag(expandedTags, filtercards, 'Hest')).toMatchSnapshot();
  });
  it('appends a range tag when it is not already selected', () => {
    const expandedTags = tagsFromURL([], filtercards);
    expect(
      toggleTag(expandedTags, filtercards, [5629, 5631])
    ).toMatchSnapshot();
  });
  it('replace a range tag when it is already selected', () => {
    const expandedTags = tagsFromURL(
      ['5629:5630', '870970-basis:123456'],
      filtercards
    );
    expect(
      toggleTag(expandedTags, filtercards, [5629, 5631])
    ).toMatchSnapshot();
  });
  it('replace a range tag when it is already selected, and the selected tag is not in range format', () => {
    const expandedTags = tagsFromURL(
      ['5629:5630', '870970-basis:123456'],
      filtercards
    );
    expect(toggleTag(expandedTags, filtercards, 5631)).toMatchSnapshot();
  });
  it('removes a range tag when it is the full range', () => {
    const expandedTags = tagsFromURL(
      ['5629:5630', '870970-basis:123456'],
      filtercards
    );
    expect(
      toggleTag(expandedTags, filtercards, [5629, 5633])
    ).toMatchSnapshot();
  });
  it('removes a range tag when the exact same range is toggled', () => {
    const expandedTags = tagsFromURL(
      ['5629:5630', '870970-basis:123456'],
      filtercards
    );
    expect(
      toggleTag(expandedTags, filtercards, [5629, 5630])
    ).toMatchSnapshot();
  });
});
