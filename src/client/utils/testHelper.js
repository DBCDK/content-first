export const createTestList = id => {
  return {
    type: 'CUSTOM_LIST',
    _id: id,
    title: 'title' + id,
    list: []
  };
};

export const createTestElement = id => {
  return {
    book: {
      pid: 'pid' + id,
      title: 'some title' + id,
      creator: 'some creator' + id,
      taxonomy_description: 'some taxonomy_description' + id
    },
    links: {
      cover: '/cover' + id
    },
    description: 'some description' + id
  };
};
