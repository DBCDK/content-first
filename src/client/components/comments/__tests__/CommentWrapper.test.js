import React from 'react';
import {CommentWrapper} from '../CommentWrapper.component';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';

jest.mock('react-textarea-autosize', () => 'textarea');

function generateComments({key = 'test', saving, error} = {}) {
  const comment = {
    comment: `comment_${key}`,
    _id: `${key}`,
    user: {
      name: 'Benny Cosmos',
      openplatformId: '1234'
    }
  };

  if (saving) {
    comment.saving = saving;
  }

  if (error) {
    comment.error = error;
  }

  return comment;
}

describe('CommentContainer', () => {
  test('Render comment', () => {
    const tree = renderer.create(
      <CommentWrapper comment={generateComments()} />
    );
    expect(tree).toMatchSnapshot();
  });
  test('Render edit form', () => {
    const comment = generateComments();
    const tree = renderer.create(
      <CommentWrapper comment={comment} user={comment.user} />
    );
    expect(tree).toMatchSnapshot();
  });
  test('Render save form', () => {
    const comment = generateComments({saving: true});
    const tree = renderer.create(
      <CommentWrapper comment={comment} user={comment.user} />
    );
    expect(tree).toMatchSnapshot();
  });
  test('Edit button', () => {
    const comment = generateComments();
    const tree = mount(
      <CommentWrapper comment={comment} user={comment.user} />
    );

    expect(tree).toMatchSnapshot();
    tree
      .find('.comment-edit-button')
      .hostNodes()
      .simulate('click');
    expect(tree).toMatchSnapshot();
  });
  test('Delete button', () => {
    const comment = generateComments();
    const deleteComment = jest.fn();
    const tree = mount(
      <CommentWrapper
        comment={comment}
        user={comment.user}
        deleteComment={deleteComment}
      />
    );
    expect(tree).toMatchSnapshot();
    tree
      .find('.comment-edit-button')
      .hostNodes()
      .simulate('click');
    tree
      .find('.comment-delete')
      .hostNodes()
      .simulate('click');
    expect(deleteComment.mock.calls[0][0]).toEqual(comment);
  });
  test('Cancel button', () => {
    const comment = generateComments();
    const tree = mount(
      <CommentWrapper comment={comment} user={comment.user} />
    );
    expect(tree).toMatchSnapshot();
    tree
      .find('.comment-edit-button')
      .hostNodes()
      .simulate('click');
    tree
      .find('.comment-cancel')
      .hostNodes()
      .simulate('click');
    expect(tree).toMatchSnapshot();
  });
  test('Save button', () => {
    const comment = generateComments();
    const editComment = jest.fn();
    const toggleComment = jest.fn();
    const tree = mount(
      <CommentWrapper
        comment={comment}
        user={comment.user}
        toggleEdit={toggleComment}
        editComment={editComment}
      />
    );
    expect(tree).toMatchSnapshot();
    tree
      .find('.comment-edit-button')
      .hostNodes()
      .simulate('click');
    tree
      .find('.comment-textarea')
      .simulate('change', {target: {value: 'some updated comment'}});
    tree
      .find('#comment-submit')
      .hostNodes()
      .simulate('click');
    expect(editComment.mock.calls[0][0]).toEqual({
      ...comment,
      comment: 'some updated comment'
    });
  });
});
