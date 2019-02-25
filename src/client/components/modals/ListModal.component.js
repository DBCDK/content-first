import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../general/ImageUpload.component';

import Modal from './Modal.component';
import Title from '../base/Title';
import Text from '../base/Text';
import T from '../base/T';
import Button from '../base/Button';
import Icon from '../base/Icon';
import Radio from '../base/Radio';
import Checkbox from '../base/Checkbox';
import Tabs from '../base/Tabs';
import {withList, withListCreator} from '../base/List/withList.hoc';

import {ADD_LIST_IMAGE} from '../../redux/list.reducer';

import './ListModal.css';

const pages = ['Listoplysninger', 'Avanceret'];

class PageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPermissions: false};
  }

  componentDidMount() {
    if (this.title) {
      this.title.select();
    }
  }

  togglePermissions(status) {
    this.setState({showPermissions: status});
  }

  onPermissionsChange = e => {
    const value = e.target.value;

    // Show/Hide permissions checkboxes
    if (value === 'public') {
      this.togglePermissions(true);
    }

    if (value === 'private') {
      this.togglePermissions(false);
    }

    //...
  };

  render() {
    const {list, className = null, updateListData, addImage} = this.props;
    const {showPermissions} = this.state;

    return (
      <div className={`listModal-page ${className}`}>
        <label>
          <T component={'list'} name={'labelName'} />
        </label>

        <input
          ref={e => (this.title = e)}
          className={`form-control`}
          name="listModal-title"
          placeholder={T({component: 'list', name: 'placeholderTitle'})}
          onChange={e => updateListData({title: e.target.value})}
          value={
            list.title
              ? list.title
              : T({component: 'list', name: 'noTitleValue'})
          }
          data-cy="listinfo-title-input"
        />

        <label className="mt-4">
          <T component={'list'} name={'labelPrivacy'} />
        </label>

        <div>
          <Radio
            value="private"
            group="privacy"
            onChange={this.onPermissionsChange}
          >
            <Text type="body">
              {T({component: 'general', name: 'private'})}
            </Text>
          </Radio>
        </div>

        <div>
          <Radio
            value="public"
            group="privacy"
            onChange={this.onPermissionsChange}
          >
            <Text type="body">{T({component: 'general', name: 'public'})}</Text>
          </Radio>
        </div>

        <div className={`pl-4 ${!showPermissions ? 'd-none' : ''}`}>
          <div>
            <Checkbox value="social" onChange={this.onPermissionsChange}>
              <Text type="body">
                {T({component: 'list', name: 'permissionsComments'})}
              </Text>
            </Checkbox>
          </div>
          <div>
            <Checkbox value="open" onChange={this.onPermissionsChange}>
              <Text type="body">
                {T({component: 'list', name: 'permissionsAdd'})}
              </Text>
            </Checkbox>
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex flex-column">
            <label>
              <T component={'general'} name={'image'} />
            </label>
            <ImageUpload
              error={list.imageError}
              loading={list.imageIsLoading}
              handleLoaded={this.onResize}
              previewImage={
                list.image ? `/v1/image/${list.image}/719/400` : null
              }
              buttonText={<T component="general" name="changeImage" />}
              buttonPosition="inside"
              onFile={img => addImage(list._id, img)}
            />
          </div>
          <div className="col-8 d-flex flex-column">
            <label>
              <T component={'general'} name={'description'} />
            </label>
            <textarea
              className="listModal-description"
              placeholder={T({
                component: 'list',
                name: 'placeholderDescription'
              })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const PageAdvanced = ({className = null}) => {
  return <div className={`listModal-page ${className}`}>Advanced</div>;
};

export class ListModal extends React.Component {
  render() {
    const {list = {}, close, updateListData, saveList} = this.props;

    return (
      <Modal
        header="Opret ny liste"
        className="listModal"
        onClose={close}
        onDone={() => {
          saveList(list);
          close();
        }}
        doneText="Opret"
        cancelText="Fortryd"
      >
        <Tabs pages={pages}>
          <PageInfo list={list} updateListData={data => updateListData(data)} />
          <PageAdvanced
            list={list}
            updateListData={data => updateListData(data)}
          />
        </Tabs>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export const mapDispatchToProps = dispatch => ({
  addImage: (_id, image) => dispatch({type: ADD_LIST_IMAGE, image, _id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withListCreator(withList(ListModal)));

// export default withList(ListModal);
