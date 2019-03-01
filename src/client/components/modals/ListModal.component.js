import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../general/ImageUpload.component';
import Pulse from '../pulse/Pulse.component';
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
import Switch from '../base/Switch';
import Tabs from '../base/Tabs';
import {withList, withListCreator} from '../base/List/withList.hoc';

import {
  percentageObjToPixel,
  pixelObjToPercentage
} from '../../utils/converter.js';

import {ADD_LIST_IMAGE} from '../../redux/list.reducer';

import './ListModal.css';

// Bookshelf dot colors
const dotColors = ['petroleum', 'fersken', 'de-york', 'due', 'korn'];

class PageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPermissions: false};
  }

  componentDidMount() {
    if (this.input) {
      setTimeout(() => {
        this.input.select();
      }, 100);
    }
  }

  togglePermissions(status) {
    this.setState({showPermissions: status});
  }

  validateInput(value) {
    let error = false;
    if (!value) {
      error = T({component: 'list', name: 'noTitle'});
    }
    this.props.onError(error);
  }

  render() {
    const {
      list,
      justCreated,
      className = null,
      addImage,
      updateListData,
      onError
    } = this.props;
    const {showPermissions} = this.state;

    return (
      <div className={`listModal-page listModal-info ${className}`}>
        <div className="modal-seperator mb-2" />
        <Input
          inputRef={e => (this.input = e)}
          className={`listModal-title`}
          name="listModal-title"
          placeholder={T({component: 'list', name: 'placeholderTitle'})}
          onChange={e => {
            updateListData({title: e.target.value});
            this.validateInput(e.target.value);
          }}
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
  constructor(props) {
    super(props);
    this.state = {wrap: false};
  }

  calcPosition = work => {
    const wrap = this.state.wrap;
    return percentageObjToPixel(
      {
        width: wrap.offsetWidth,
        height: wrap.offsetHeight
      },
      work.position
    );
  };

  onPulseDragStop(e, ui, work) {
    const wrap = this.state.wrap;
    const pos = pixelObjToPercentage(
      {
        width: wrap.offsetWidth,
        height: wrap.offsetHeight
      },
      {
        x: ui.x,
        y: ui.y
      }
    );

    const newList = this.props.list.list.map(b => {
      if (b === work) {
        work.position = pos;
      }
      return b;
    });

    this.props.updateListData({list: newList});
  }

  render() {
    const {
      list,
      justCreated,
      className = null,
      addImage,
      updateListData
    } = this.props;
    const {wrap} = this.state;

    return (
      <div className={`listModal-page listModal-advanced ${className}`}>
        <div className="modal-seperator" />
        <div
          ref={e => {
            if (e && wrap !== e) {
              this.setState({wrap: e});
            }
          }}
          className="position-relative mt-3 w-100"
        >
          {list.image &&
            list.list.map(work => {
              return (
                <Pulse
                  noAnimation={justCreated}
                  dragContainer={'parent'}
                  position={this.calcPosition(work)}
                  draggable={!justCreated}
                  label={work.book.title}
                  key={'pulse-' + work.pid}
                  color={list.dotColor || false}
                  onStop={(e, ui) => this.onPulseDragStop(e, ui, work)}
                />
              );
            })}

          {!list.image ? (
            <ImageUpload
              style={{
                borderRadius: 0,
                border: 0,
                width: '100%',
                height: list.image ? 'auto' : '325px',
                backgroundImage: `url(img/general/bookshelf.jpg)`
              }}
              heading={<T component="list" name="uploadBookcaseImageHeading" />}
              template={list.image ? false : 'img/general/bookshelf.jpg'}
              error={list.imageError}
              loading={list.imageIsLoading}
              handleLoaded={this.onResize}
              previewImage={
                list.image ? `/v1/image/${list.image}/719/400` : null
              }
              buttonText={<T component="list" name="uploadBookcaseImage" />}
              buttonPosition="inside"
              onFile={img => addImage(list._id, img)}
            />
          ) : (
            <img
              src={`/v1/image/${list.image}/719/400`}
              width="100%"
              height="auto"
            />
          )}
        </div>

        {list.image && (
          <div className="row">
            <div className="col-6">
              <div>
                <label className="mt-3">
                  <Text type="body">
                    <T component="list" name="dotColorsTitle" />
                  </Text>
                </label>
              </div>
              <div className="listModal-color-select-bg p-2">
                <div className="listModal-color-select d-flex flex-row align-items-center position-relative">
                  {dotColors.map((color, i) => {
                    const active = color === list.dotColor ? true : false;
                    const disableClass = !active ? 'pulse-expand-disable' : '';

                    return (
                      <Pulse
                        className={'mr-2 ' + disableClass}
                        dragContainer={'parent'}
                        draggable={false}
                        pid={false}
                        label={false}
                        color={color}
                        active={active}
                        key={'pulse-' + i}
                        onClick={() => updateListData({dotColor: color})}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-end">
                <label className="mt-3">
                  <Text type="body">
                    <T component="list" name="bookcaseTitle" />
                  </Text>
                </label>
              </div>
              <div className="d-flex justify-content-end">
                <Switch
                  name="toggleBookcase"
                  checked={list.template === 'bookcase' ? true : false}
                  onChange={() => {
                    const template =
                      list.template === 'bookcase' ? 'list' : 'bookcase';
                    updateListData({template});
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const pages = [
  T({component: 'tabs', name: 'listInfo'}),
  T({component: 'tabs', name: 'advanced'})
];

export class ListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null, hideActions: false};
  }

  handlePageChange = page => {
    let hideActions = false;
    if (pages[page] === T({component: 'tabs', name: 'advanced'})) {
      hideActions = true;
    }
    this.setState({hideActions});
  };

  handleError = error => {
    if (this.state.error !== error) {
      this.setState({error});
    }
  };

  updateListData = data => {
    this.setState();
  };

  render() {
    const {
      list = {},
      justCreated,
      close,
      addImage,
      updateListData,
      storeList,
      deleteList
    } = this.props;
    const {error, hideActions} = this.state;

    return (
      <Modal
        header={T({component: 'list', name: 'createNew'})}
        className="listModal"
        onClose={() => close()}
        onDone={() => {
          storeList(list);
          close();
        }}
        doneText={
          justCreated
            ? T({component: 'general', name: 'create'})
            : T({component: 'general', name: 'save'})
        }
        cancelText={T({component: 'general', name: 'cancel'})}
        hideConfirm={hideActions}
        hideCancel={hideActions}
        onError={error}
      >
        <Tabs pages={pages} onPageChange={this.handlePageChange}>
          <PageInfo
            list={list}
            justCreated={justCreated}
            addImage={addImage}
            updateListData={data => this.updateListData(data)}
            onError={this.handleError}
          />
          <PageAdvanced
            list={list}
            justCreated={justCreated}
            addImage={addImage}
            updateListData={data => this.updateListData(data)}
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
