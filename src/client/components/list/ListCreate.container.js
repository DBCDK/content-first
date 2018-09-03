import React from 'react';
import {connect} from 'react-redux';

import {
  LIST_LOAD_REQUEST,
  addElementToList,
  removeElementFromList,
  updateList,
  storeList,
  getListById,
  addList,
  removeList,
  ADD_LIST_IMAGE
} from '../../redux/list.reducer';
import {saveList} from '../../utils/requestLists';
import DragableList from './ListDrag.component';
import Textarea from 'react-textarea-autosize';
import {HISTORY_REPLACE} from '../../redux/middleware';
import BookSearchSuggester from './BookSearchSuggester';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';
import ImageUpload from '../general/ImageUpload.component';
import Spinner from '../general/Spinner.component';
import Pulse from '../pulse/Pulse.component';

export const ListItem = ({item, onChange}) => (
  <div key={item.book.pid} className="flex list-item">
    <BookCover className="list-item__img" book={item.book} />
    <div className="list-item__details">
      <div className="list-item__title">{item.book.title}</div>
      <div className="list-item__author">{item.book.creator}</div>
      <Textarea
        onChange={e => onChange(item, e.currentTarget.value)}
        value={item.description || ''}
        className="form-control"
        name="list-description"
        placeholder="Skriv en kommentar til bogen"
      />
    </div>
  </div>
);

const ListBooks = props => (
  <div className="list-drag">
    <BookSearchSuggester
      list={props.list}
      onSubmit={book => props.addElementToList(book, props.list._id)}
    />
    <DragableList
      list={props.list.list}
      renderListItem={ListItem}
      onUpdate={updatedList => {
        props.updateList({...props.list, list: updatedList});
      }}
      onRemove={book => props.removeElementFromList(book, props.list._id)}
    />
  </div>
);

const ListCheckbox = ({name, checked, onClick, text}) => (
  <div className="list-creator__checkbox">
    <label htmlFor={name}>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onClick={onClick}
      />
      <span />
      {text}
    </label>
  </div>
);

export class ListCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      isNew: false,
      dotHandlerWidth: 0,
      dotHandlerHeight: 0
    };
  }
  async componentWillMount() {
    // check if we need to create a new list
    if (!this.props.id && this.props.createList) {
      this.props.createList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.currentList &&
      nextProps.currentList &&
      !nextProps.currentList.title
    ) {
      this.setState({isNew: true});
    }
    if (
      this.props.currentList &&
      this.props.currentList.deletingIsLoading &&
      !nextProps.currentList
    ) {
      this.props.exitList('/profile');
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize = () => {
    this.setState({
      dotHandlerWidth: this.refs.dotHandler
        ? this.refs.dotHandler.clientWidth
        : 0,
      dotHandlerHeight: this.refs.dotHandler
        ? this.refs.dotHandler.clientHeight
        : 0
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.dotHandler) {
      if (prevState.dotHandlerWidth !== this.refs.dotHandler.clientWidth) {
        this.setState({
          dotHandlerWidth: this.refs.dotHandler.clientWidth,
          dotHandlerHeight: this.refs.dotHandler.clientHeight
        });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    // reset any unsaved changes
    // for now we just reload users lists from backend
    // a client side undo mechanism would be more efficient
    this.props.loadLists();
  }
  // componentDidMount() {
  //   this.props.updateList({...this.props.currentList, ...currentList});
  // }
  async onSubmit(e) {
    e.preventDefault();
    if (!this.props.currentList.title) {
      this.setState({hasError: true});
      window.scrollTo(0, 0);
      return;
    }
    await this.props.storeList(this.props.currentList);
  }
  onChange(currentList) {
    this.props.updateList({...this.props.currentList, ...currentList});
  }
  toggleStatus(selector) {
    const currentList = this.props.currentList;

    this.props.updateList({
      _id: currentList._id,
      [selector]: !currentList[selector]
    });

    // Relations between checkboxes
    // if public gets unchecked, uncheck both social and open
    if (selector === 'public' && currentList.public) {
      this.props.updateList({
        _id: currentList._id,
        social: false
      });
      this.props.updateList({
        _id: currentList._id,
        open: false
      });
      // if open or social gets checked, public is forced checked
    } else if (!currentList.social || !currentList.open) {
      this.props.updateList({
        _id: currentList._id,
        public: true
      });
    }
  }

  percentageObjToPixel(e, pos) {
    const x = (Number(pos.x) * this.state.dotHandlerWidth) / 100;
    const y = (Number(pos.y) * this.state.dotHandlerHeight) / 100;
    return {x, y};
  }

  pixelObjToPercentage(e, pos) {
    const x = (Number(pos.x) / this.state.dotHandlerWidth) * 100;
    const y = (Number(pos.y) / this.state.dotHandlerHeight) * 100;
    return {x, y};
  }

  render() {
    if (!this.props.currentList) {
      return null;
    }

    const template = 'simple';

    let size = '/150/150';
    let bookcaseBoxClass = '';
    let imgUploadStyles = {};

    if (
      this.props.currentList &&
      template === 'bookcase' &&
      this.props.currentList.image &&
      !this.props.currentList.imageIsLoading
    ) {
      imgUploadStyles = {width: '100%', height: 'auto'};
      bookcaseBoxClass = 'dotHandler-active';
      size = '/1200/600';
    }

    const isNew = this.state.isNew;
    const currentList = this.props.currentList;
    const profile = this.props.profile
      ? this.props.profile
      : this.props.profiles[currentList.owner];

    return (
      <div className="container">
        <div className="list-creator">
          <h1 className="list-creator__headline mt2">
            {isNew ? 'Opret liste' : 'Redigér liste'}
          </h1>
          <div className="row">
            <div className="col-8">
              <form className="mb4" onSubmit={e => this.onSubmit(e)}>
                <div className="list-details">
                  <div className="form-group">
                    <span
                      className={`required ${
                        !currentList.title && this.state.hasError
                          ? 'has-error'
                          : ''
                      }`}
                    >
                      <input
                        className="form-control"
                        type="text"
                        name="list-title"
                        placeholder="Giv din liste en titel"
                        onChange={e =>
                          this.onChange({title: e.currentTarget.value})
                        }
                        value={currentList.title}
                      />
                      {!currentList.title && this.state.hasError ? (
                        <div className="alert alert-danger">
                          Din liste skal have en titel
                        </div>
                      ) : (
                        ''
                      )}
                    </span>
                    <Textarea
                      className="form-control list-details__description"
                      name="list-description"
                      placeholder="Skriv lidt om din liste"
                      onChange={e =>
                        this.onChange({description: e.currentTarget.value})
                      }
                      value={currentList.description}
                    />
                    <div className="mt1 text-left">
                      <ImageUpload
                        className={'mt1 ' + bookcaseBoxClass}
                        error={currentList.imageError}
                        style={{borderRadius: '5px', ...imgUploadStyles}}
                        loading={currentList.imageIsLoading}
                        handleLoaded={this.onResize}
                        previewImage={
                          currentList.image
                            ? `/v1/image/${currentList.image}${size}`
                            : null
                        }
                        onFile={img => {
                          this.props.addImage(currentList._id, img);
                        }}
                      >
                        {template === 'bookcase' ? (
                          <div className="dotHandler-wrap">
                            <div className="col-4 bookcase-profile">
                              <img
                                src={'/v1/image/' + profile.image + '/100/100'}
                                alt={profile.name + ' bogreol'}
                              />
                              <h4>{profile.name}</h4>
                            </div>
                            <div className="col-8 dotHandler" ref="dotHandler">
                              {currentList.list.map(p => {
                                const position = this.percentageObjToPixel(
                                  this.refs.dotHandler,
                                  p.position || {
                                    x: Math.floor(
                                      Math.random() * Math.floor(100)
                                    ),
                                    y: Math.floor(
                                      Math.random() * Math.floor(100)
                                    )
                                  }
                                );
                                return (
                                  <Pulse
                                    dragContainer={'parent'}
                                    position={position}
                                    draggable={true}
                                    pid={p.book.pid}
                                    label={p.book.title}
                                    key={'pulse-' + p.book.pid}
                                    onStart={e => {
                                      e.preventDefault();
                                    }}
                                    onStop={(e, ui) => {
                                      const pos = this.pixelObjToPercentage(
                                        this.refs.dotHandler,
                                        {x: ui.x, y: ui.y}
                                      );
                                      const newList = currentList.list.map(
                                        listItem => {
                                          if (listItem === p) {
                                            p.position = pos;
                                          }
                                          return listItem;
                                        }
                                      );
                                      this.props.updateList({
                                        ...currentList,
                                        ...newList
                                      });
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </ImageUpload>
                    </div>
                  </div>
                </div>
                <h2 className="list-creator__headline">
                  Tilføj bøger til listen
                </h2>
                <ListBooks
                  updateList={this.props.updateList}
                  addElementToList={this.props.addElementToList}
                  removeElementFromList={this.props.removeElementFromList}
                  list={this.props.currentList}
                />
                <div className="mt3 mb3">
                  <ListCheckbox
                    name="public"
                    text="Skal listen være offentlig?"
                    checked={this.props.currentList.public || false}
                    onClick={() => this.toggleStatus('public')}
                  />
                  <ListCheckbox
                    name="social"
                    text="Skal andre kunne kommentere på listen?"
                    checked={this.props.currentList.social || false}
                    onClick={() => this.toggleStatus('social')}
                  />
                  <ListCheckbox
                    name="open"
                    text="Skal andre kunne føje til listen?"
                    checked={this.props.currentList.open || false}
                    onClick={() => this.toggleStatus('open')}
                  />
                </div>
                <div className="list-creator__submit text-right">
                  <button className="btn btn-primary" type="submit">
                    Gem liste
                  </button>
                </div>
                <span
                  className="text-danger"
                  style={{cursor: 'pointer'}}
                  onClick={() =>
                    this.props.confirmDeleteModal(this.props.currentList._id)
                  }
                >
                  {isNew ? (
                    ''
                  ) : this.props.currentList.deletingIsLoading ? (
                    <span>
                      <Spinner size="12px" />{' '}
                    </span>
                  ) : (
                    'Slet liste'
                  )}
                </span>
                {isNew ? (
                  ''
                ) : (
                  <span className="text-danger" style={{cursor: 'default'}}>
                    {' | '}
                  </span>
                )}
                <Link href="/profile" replace={HISTORY_REPLACE}>
                  {isNew
                    ? 'Fortryd oprettelse af liste'
                    : 'Fortryd redigering af liste'}
                </Link>
              </form>
            </div>
            <div className="col-4" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentList: getListById(state, ownProps.id),
    profiles: state.users.toJS()
  };
};
export const mapDispatchToProps = dispatch => ({
  addImage: (_id, image) => dispatch({type: ADD_LIST_IMAGE, image, _id}),
  updateList: data => dispatch(updateList(data)),
  storeList: async list => {
    await dispatch(storeList(list._id));
    dispatch({type: HISTORY_REPLACE, path: '/profile'});
  },
  exitList: path => dispatch({type: HISTORY_REPLACE, path: path}),
  addElementToList: (book, _id) => dispatch(addElementToList(book, _id)),
  removeElementFromList: (book, _id) =>
    dispatch(removeElementFromList(book, _id)),
  loadLists: () => dispatch({type: LIST_LOAD_REQUEST}),
  createList: async () => {
    const {_id} = await saveList({});
    dispatch(addList({_id}));
    dispatch({
      type: HISTORY_REPLACE,
      path: `/lister/${_id}/rediger`
    });
  },
  confirmDeleteModal: _id => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: 'Skal denne liste slettes?',
        reason: 'Er du sikker på du vil slette den valgte liste.',
        confirmText: 'Slet liste',
        onConfirm: () =>
          dispatch(
            removeList(_id),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          ),
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCreator);
