import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../../general/ImageUpload.component';
import Pulse from '../../pulse/Pulse.component';
import Modal from '../Modal/Modal.component';
import Text from '../../base/Text';
import T from '../../base/T';
import Input from '../../base/Input';
import Textarea from '../../base/Textarea';
import Radio from '../../base/Radio';
import Checkbox from '../../base/Checkbox';
import Switch from '../../base/Switch';
import Tabs from '../../base/Tabs';
import {withList, withListCreator} from '../../hoc/List';

import {
  percentageObjToPixel,
  pixelObjToPercentage
} from '../../../utils/converter.js';

import {addImage} from '../../../utils/requester';

import './ListModal.css';

// Bookshelf dot colors
const dotColors = ['petroleum', 'fersken', 'de-york', 'due', 'korn'];

class PageInfo extends React.Component {
  componentDidMount() {
    if (this.input) {
      setTimeout(() => {
        this.input.select();
      }, 100);
    }
  }

  validateInput(value) {
    let error = false;
    if (!value) {
      error = T({component: 'list', name: 'noTitle'});
    }
    this.props.onError(error);
  }

  render() {
    const {list, handleImage, className = null, updateListData} = this.props;

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
            checked={!list._public}
            onChange={() =>
              updateListData({_public: false, open: false, social: false})
            }
          >
            <Text type="body">
              {T({component: 'general', name: 'private'})}
            </Text>
          </Radio>
        </div>

        <div>
          <Radio
            group="privacy"
            checked={list._public}
            onChange={() => updateListData({_public: true})}
            data-cy="public-radio-btn"
          >
            <Text type="body">{T({component: 'general', name: 'public'})}</Text>
          </Radio>
        </div>

        <div
          className={`listModal-permissions pl-4 ${
            list._public ? 'permissions-visible' : ''
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
          <div className="col-6 col-md-4 pr-2">
            <label className="m-0">
              <T component={'general'} name={'image'} />
            </label>
            <ImageUpload
              style={{width: '100%'}}
              error={list.imageError}
              loading={list.imageIsLoading}
              handleLoaded={this.onResize}
              previewImage={
                list.image ? `/v1/image/${list.image}/150/150` : null
              }
              buttonText={<T component="general" name="changeImage" />}
              buttonPosition="inside"
              onFile={img => handleImage(img)}
            />
          </div>
          <div className="col-6 col-md-8 pl-2">
            <Textarea
              className="listModal-description"
              value={list.description}
              placeholder={T({
                component: 'list',
                name: 'placeholderDescription'
              })}
              onChange={e => updateListData({description: e.target.value})}
              data-cy="listinfo-description-input"
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
    const {list, className = null, handleImage, updateListData} = this.props;
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
                  pid={work.pid}
                  noAnimation={false}
                  dragContainer={'parent'}
                  position={this.calcPosition(work)}
                  draggable={true}
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
                backgroundImage: `url(/img/general/bookshelf.jpg)`
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
              onFile={img => handleImage(img)}
            />
          ) : (
            <img
              src={`/v1/image/${list.image}/719/400`}
              width="100%"
              height="auto"
              alt="Upload Bookcase"
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
    this.state = {
      error: null,
      hideActions: false,
      list: {
        image: false,
        imageError: false,
        imageIsLoading: false
      }
    };
  }

  componentDidMount() {
    if (this.props.list) {
      this.setState({list: this.props.list});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      const list = {
        ...this.props.list,
        ...this.state.list
      };
      this.setState({list});
    }
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

  async handleImage(image) {
    this.handleImageState({
      imageIsLoading: true
    });

    const img = await this.props.addImage(image);

    this.handleImageState({
      image: img.id,
      imageError: img.errors,
      imageIsLoading: false
    });
  }

  handleImageState(imgStatus) {
    const list = {
      ...this.state.list,
      ...imgStatus
    };

    this.setState({list});
  }

  updateListData = data => {
    const list = {...this.state.list, ...data};
    this.setState({list});
  };

  render() {
    const {justCreated, close, updateListData, storeList} = this.props;
    const {error, hideActions, list} = this.state;

    return (
      <Modal
        header={
          justCreated
            ? T({component: 'list', name: 'createNew'})
            : T({component: 'list', name: 'editList'})
        }
        className="listModal"
        onClose={() => close()}
        onDone={() => {
          updateListData(list);
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
        <Tabs
          pages={pages}
          onPageChange={this.handlePageChange}
          customSettings={{autoHeight: false}}
        >
          <PageInfo
            list={list}
            justCreated={justCreated}
            handleImage={image => this.handleImage(image)}
            updateListData={data => this.updateListData(data)}
            onError={this.handleError}
          />
          <PageAdvanced
            list={list}
            justCreated={justCreated}
            handleImage={image => this.handleImage(image)}
            updateListData={data => this.updateListData(data)}
          />
        </Tabs>
      </Modal>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export const mapDispatchToProps = () => ({
  addImage: image => addImage(image)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withListCreator(withList(ListModal)));
