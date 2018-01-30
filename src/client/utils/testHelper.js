export const createTestList = id => {
  return {
    data: {
      type: 'CUSTOM_LIST',
      id,
      title: 'title' + id,
      list: []
    },
    links: {self: '/v1/lists/' + id}
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
