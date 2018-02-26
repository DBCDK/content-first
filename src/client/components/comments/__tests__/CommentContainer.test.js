import React from 'react';
import {CommentContainer} from '../Comment.container';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';

jest.mock('react-textarea-autosize', () => 'textarea');

function generateComments(count) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push({
      comment: `comment${i}`,
      _id: `${i}`
    });
  }
  return comments;
}

describe('CommentContainer', () => {
  test('Component fetches comments on mount', () => {
    const fetch = jest.fn();
    const tree = renderer
      .create(
        <CommentContainer
          id="some_id"
          fetchComments={fetch}
          comments={{comments: []}}
          user={{image: 'image_id'}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(fetch.mock.calls[0][0]).toEqual('some_id');
  });
  test('Component renders a list of comments', () => {
    const tree = renderer
      .create(
        <CommentContainer
          id="some_id"
          fetchComments={jest.fn()}
          comments={{
            comments: generateComments(2)
          }}
          user={{image: 'image_id'}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Component renders error', () => {
    const tree = mount(
      <CommentContainer
        id="some_id"
        fetchComments={jest.fn()}
        comments={{
          error: {
            comment: 'comment3',
            error: 'some error occures'
          },
          comments: generateComments(2)
        }}
        user={{image: 'image_id'}}
      />
    );
    tree.setState({newCommentValue: 'comment3'});
    expect(tree).toMatchSnapshot();
  });
  test('Component renders saving overlay', () => {
    const tree = mount(
      <CommentContainer
        id="some_id"
        fetchComments={jest.fn()}
        comments={{
          comments: [
            ...generateComments(2),
            {comment: 'comment new', saving: true, _id: 'new_comment'}
          ]
        }}
        user={{image: 'image_id'}}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  test('Component renders all comments', () => {
    const tree = mount(
      <CommentContainer
        id="some_id"
        fetchComments={jest.fn()}
        comments={{
          comments: generateComments(5)
        }}
        user={{image: 'image_id'}}
      />
    );
    tree.setState({showAll: true});
    expect(tree).toMatchSnapshot();
  });
  test('Component Submits a new comment', () => {
    const addComment = jest.fn();
    const tree = mount(
      <CommentContainer
        id="some_id"
        fetchComments={jest.fn()}
        addComment={addComment}
        comments={{
          comments: []
        }}
        user={{image: 'image_id'}}
      />
    );
    tree.setState({newCommentValue: 'a new comment'});
    tree.find('#comment-submit').simulate('click');
    expect(addComment.mock.calls[0]).toEqual(['some_id', 'a new comment']);
  });
  test('Toggle all comments', () => {
    const tree = mount(
      <CommentContainer
        id="some_id"
        fetchComments={jest.fn()}
        comments={{
          comments: generateComments(5)
        }}
        user={{image: 'image_id'}}
      />
    );
    const toggleButton = tree.find('#comment-toggle');
    expect(tree).toMatchSnapshot();
    expect(toggleButton.text()).toContain('Vis alle kommentarer');
    toggleButton.simulate('click');
    expect(toggleButton.text()).toContain('Vis færre kommentarer');
    expect(tree).toMatchSnapshot();
  });
});
