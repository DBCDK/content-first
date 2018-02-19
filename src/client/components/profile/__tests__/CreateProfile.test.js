/* eslint-disable no-undefined */
import React from 'react';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';

import {CreateProfilePage} from '../CreateProfilePage';
const image =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
jest.mock('../../general/Spinner.component', () => 'spinner');

describe('Image Upload', () => {
  describe('render function', () => {
    it('renders an image upload form', () => {
      const tree = renderer.create(<CreateProfilePage />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('Add image', done => {
      const onFile = jest.fn();
      const tree = mount(<CreateProfilePage addImage={onFile} />);
      tree
        .find('input')
        .first()
        .simulate('change', {target: {files: [image]}});
      tree.update();
      expect(tree).toMatchSnapshot();
      expect(onFile.mock.calls[0][0]).toEqual(image);
      done();
    });
  });
});
