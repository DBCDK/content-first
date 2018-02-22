/* eslint-disable no-undefined */
import React from 'react';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';

import ImageUpload from '../ImageUpload.component';
const image =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
jest.mock('../../general/Spinner.component', () => 'Spinner');

describe('Image Upload', () => {
  describe('render function', () => {
    it('renders an image upload form', () => {
      const tree = renderer.create(<ImageUpload />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('Add spinner on loading', () => {
      const tree = renderer.create(<ImageUpload loading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('Add preview image', () => {
      const tree = renderer
        .create(<ImageUpload previewImage={image} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('Add image', () => {
      const onFile = jest.fn();
      const tree = mount(<ImageUpload previewImage={image} onFile={onFile} />);
      tree
        .find('input')
        .first()
        .simulate('change', {target: {files: [image]}});
      tree.update();
      expect(tree).toMatchSnapshot();
      expect(onFile.mock.calls[0][0]).toEqual(image);
    });
  });
});
