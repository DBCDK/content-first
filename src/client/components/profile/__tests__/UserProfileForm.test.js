/* eslint-disable no-undefined */
import React from 'react';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';

import UserProfileForm from '../UserProfileForm.component';
jest.mock('../../general/Spinner.component', () => 'spinner');

describe('UserProfileForm', () => {
  describe('render function', () => {
    it('renders an user profile form', () => {
      const tree = renderer.create(<UserProfileForm />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('It adds validation error', done => {
      const tree = mount(<UserProfileForm />);
      const form = tree.find('form').first();
      form.simulate('submit');
      tree.update();
      expect(tree).toMatchSnapshot();
      tree.setProps({acceptedTerms: true});
      form.simulate('submit');
      tree.update();
      expect(tree).toMatchSnapshot();
      done();
    });
    it('It submits form', done => {
      const updateProfile = jest.fn();

      const tree = mount(
        <UserProfileForm
          acceptedTerms={true}
          name="some_name"
          imageId="some_image_id"
          updateProfile={updateProfile}
        />
      );
      tree
        .find('form')
        .first()
        .simulate('submit');
      expect(updateProfile.mock.calls[0][0]).toEqual({
        acceptedTerms: true,
        image: 'some_image_id',
        name: 'some_name'
      });
      done();
    });
  });
});
