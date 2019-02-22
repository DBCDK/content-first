import React from 'react';
import {connect} from 'react-redux';

import Textarea from 'react-textarea-autosize';

import Modal from './Modal.component';
import Title from '../base/Title';
import Text from '../base/Text';
import T from '../base/T';
import Button from '../base/Button';
import Icon from '../base/Icon';

import Radio from '../base/Radio';
import Checkbox from '../base/Checkbox';

import Tabs from '../base/Tabs';

import withList from '../base/List/withList.hoc';

import './ListModal.css';

const pages = ['Listoplysninger', 'Avanceret'];

const PageInfo = ({list, className = null, onTitleChange}) => {
  // autofocus text in title input
  if (this.title) {
    this.title.select();
  }

  function onPrivacyChange(e) {
    console.log('e onChange', e);
    alert('i changed');
  }

  const showPermissions = true;

  return (
    <div className={`listModal-page ${className}`}>
      <label>
        <T component={'list'} name={'labelName'} />
      </label>

      <input
        ref={e => (this.title = e)}
        className={`form-control`}
        name="list-title"
        placeholder={T({component: 'list', name: 'placeholderTitle'})}
        onChange={onTitleChange}
        value={
          list && list.title
            ? list.title
            : T({component: 'list', name: 'noTitleValue'})
        }
        data-cy="listinfo-title-input"
      />

      <label className="mt-4">
        <T component={'list'} name={'labelPrivacy'} />
      </label>

      <div>
        <Radio group="privacy" onChange={onPrivacyChange}>
          <Text type="body">{T({component: 'general', name: 'private'})}</Text>
        </Radio>
      </div>

      <div>
        <Radio group="privacy">
          <Text type="body">{T({component: 'general', name: 'public'})}</Text>
        </Radio>
      </div>

      <div className={`pl-4 ${!showPermissions ? 'd-none' : ''}`}>
        <div>
          <Checkbox>
            <Text type="body">
              {T({component: 'list', name: 'permissionsComments'})}
            </Text>
          </Checkbox>
        </div>
        <div>
          <Checkbox>
            <Text type="body">
              {T({component: 'list', name: 'permissionsAdd'})}
            </Text>
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

const PageAdvanced = ({className = null}) => {
  return <div className={`listModal-page ${className}`}>Advanced</div>;
};

export class ListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: null};
  }

  componentDidMount() {
    if (!this.props.list) {
      this.props.createList();
    }
  }

  render() {
    const {list, close, saveList} = this.props;

    console.log('this.state.id', this.state.id);

    return (
      <Modal
        header="Opret ny liste"
        className="listModal"
        onClose={close}
        onDone={() => {
          // updateListData({
          //   _id: list._id,
          //   template: this.state.template,
          //   public: this.state.public,
          //   social: this.state.social,
          //   open: this.state.open
          // });
          //saveList(list);
          close();
        }}
        doneText="Opret"
        cancelText="Fortryd"
      >
        <Tabs pages={pages}>
          <PageInfo list={list} />
          <PageAdvanced list={list} />
        </Tabs>
      </Modal>
    );
  }
}

export default withList(ListModal);
