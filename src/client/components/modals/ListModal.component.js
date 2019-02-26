import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../general/ImageUpload.component';

import Modal from './Modal.component';
import Title from '../base/Title';
import Text from '../base/Text';
import T from '../base/T';
import Button from '../base/Button';
import Icon from '../base/Icon';
import Input from '../base/Input';
import Textarea from '../base/Textarea';
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
    if (this.input) {
      setTimeout(() => {
        this.input.select();
      }, 1500);
    }
  }

  togglePermissions(status) {
    this.setState({showPermissions: status});
  }

  render() {
    const {list, className = null, addImage, updateListData} = this.props;
    const {showPermissions} = this.state;

    return (
      <div className={`listModal-page ${className}`}>
        <div className="modal-seperator mb-2" />
        <Input
          inputRef={e => (this.input = e)}
          className={`listModal-title`}
          name="listModal-title"
          placeholder={T({component: 'list', name: 'placeholderTitle'})}
          onChange={e => updateListData({title: e.target.value})}
          value={list.title}
          data-cy="listinfo-title-input"
        >
          <T component={'list'} name={'labelName'} />
        </Input>

        <label className="mt-4 mb-4">
          <T component={'list'} name={'labelPrivacy'} />
        </label>

        <div>
          <Radio
            group="privacy"
            checked={!list.public}
            onChange={e => {
              this.togglePermissions(false);
              updateListData({public: false, open: false, social: false});
            }}
          >
            <Text type="body">
              {T({component: 'general', name: 'private'})}
            </Text>
          </Radio>
        </div>

        <div>
          <Radio
            group="privacy"
            checked={list.public}
            onChange={e => {
              this.togglePermissions(true);
              updateListData({public: true});
            }}
          >
            <Text type="body">{T({component: 'general', name: 'public'})}</Text>
          </Radio>
        </div>

        <div
          className={`listModal-permissions pl-4 ${
            showPermissions ? 'permissions-visible' : ''
          }`}
        >
          <div>
            <Checkbox
              checked={list.social}
              onChange={() => updateListData({social: !list.social})}
            >
              <Text type="body">
                {T({component: 'list', name: 'permissionsComments'})}
              </Text>
            </Checkbox>
          </div>
          <div>
            <Checkbox
              checked={list.open}
              onChange={() => updateListData({open: !list.open})}
            >
              <Text type="body">
                {T({component: 'list', name: 'permissionsAdd'})}
              </Text>
            </Checkbox>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-6 col-md-4">
            <label className="m-0">
              <T component={'general'} name={'image'} />
            </label>
            <ImageUpload
              error={list.imageError}
              loading={list.imageIsLoading}
              handleLoaded={this.onResize}
              previewImage={
                list.image ? `/v1/image/${list.image}/150/150` : null
              }
              buttonText={<T component="general" name="changeImage" />}
              buttonPosition="inside"
              onFile={img => addImage(list._id, img)}
            />
          </div>
          <div className="col-6 col-md-8">
            <Textarea
              className="listModal-description"
              value={list.description}
              placeholder={T({
                component: 'list',
                name: 'placeholderDescription'
              })}
              onChange={e => updateListData({description: e.target.value})}
            >
              <T component={'general'} name={'description'} />
            </Textarea>
          </div>
        </div>
      </div>
    );
  }
}

class PageAdvanced extends React.Component {
  render() {
    const {className = null} = this.props;

    return (
      <div className={`listModal-page ${className}`}>
        <div className="modal-seperator" />
        Advanced
      </div>
    );
  }
}

export class ListModal extends React.Component {
  render() {
    const {list = {}, close, addImage, updateListData, saveList} = this.props;

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
          <PageInfo
            list={list}
            addImage={addImage}
            updateListData={data => updateListData(data)}
          />
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
