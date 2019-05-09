import {tagsFromURL, addTag, removeTag} from '../';
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
  it('tag is removed', () => {
    const expandedTags = tagsFromURL(
      ['Peter Hansen', '870970-basis:123456', '5643', '5629:5631'],
      filtercards
    );
    expect(removeTag(expandedTags, '870970-basis:123456')).toMatchSnapshot();
    expect(removeTag(expandedTags, 'Peter Hansen')).toMatchSnapshot();
    expect(removeTag(expandedTags, 5643)).toMatchSnapshot();
    expect(removeTag(expandedTags, [5629, 5631])).toMatchSnapshot();
  });

  it('tag is added', () => {
    const expandedTags = tagsFromURL(['Peter Hansen'], filtercards);
    expect(
      addTag(expandedTags, filtercards, '870970-basis:123456')
    ).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, 'Peter Hansen')).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, 5643)).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, [5629, 5631])).toMatchSnapshot();
  });

  it('existing range is replaced', () => {
    const expandedTags = tagsFromURL(['5629:5631'], filtercards);
    expect(addTag(expandedTags, filtercards, [5630, 5632])).toMatchSnapshot();
  });
  it('tag add is ignored when tag is already in a selected range', () => {
    const expandedTags = tagsFromURL(['5629:5632'], filtercards);
    expect(addTag(expandedTags, filtercards, 5629)).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, 5630)).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, 5631)).toMatchSnapshot();
    expect(addTag(expandedTags, filtercards, 5632)).toMatchSnapshot();
  });
  it('tag range is updated to the left', () => {
    const expandedTags = tagsFromURL(['5630:5632'], filtercards);
    expect(addTag(expandedTags, filtercards, 5629)).toMatchSnapshot();
  });
  it('tag range is updated to the right', () => {
    const expandedTags = tagsFromURL(['5630:5632'], filtercards);
    expect(addTag(expandedTags, filtercards, 5633)).toMatchSnapshot();
  });
});
