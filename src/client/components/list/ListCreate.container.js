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
import Modal from '../modals/Modal.component';
import {OPEN_MODAL, CLOSE_MODAL} from '../../redux/modal.reducer';
const ListDetails = ({
  id,
  title,
  description,
  template,
  hasError,
  onChange,
  addImage,
  imageError,
  imageIsLoading,
  image
}) => (
  <div className="list-details">
    <div className="form-group">
      <span className={`required ${!title && hasError ? 'has-error' : ''}`}>
        <input
          className="form-control"
          type="text"
          name="list-title"
          placeholder="Giv din liste en titel"
          onChange={e => onChange({title: e.currentTarget.value})}
          value={title}
        />
        {!title && hasError ? (
          <div className="alert alert-danger">Din liste skal have en titel</div>
        ) : (
          ''
        )}
      </span>
      <Textarea
        className="form-control list-details__description"
        name="list-description"
        placeholder="Skriv lidt om din liste"
        onChange={e => onChange({description: e.currentTarget.value})}
        value={description}
      />
      <div>
        <span className="ml1">Skal vises som</span>
        <select
          value={template || 'simple'}
          onChange={e => onChange({template: e.currentTarget.value})}
          className="form-control ml1"
          style={{width: 'auto', display: 'inline-block'}}
        >
          <option value="simple">simpel liste</option>
          <option value="circle">visuel liste</option>
        </select>
      </div>

      <div className="mt1 text-left">
        <ImageUpload
          className="mt1"
          icon="glyphicon-picture"
          error={imageError}
          style={{borderRadius: '5%'}}
          loading={imageIsLoading}
          previewImage={image ? `/v1/image/${image}/150/150` : null}
          onFile={img => {
            addImage(id, img);
          }}
        />
      </div>
    </div>
  </div>
);

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
      onSubmit={book => props.addElementToList(book, props.list.id)}
    />
    <DragableList
      list={props.list.list}
      renderListItem={ListItem}
      onUpdate={updatedList => {
        props.updateList({...props.list, list: updatedList});
      }}
      onRemove={book => props.removeElementFromList(book, props.list.id)}
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
  constructor() {
    super();
    this.state = {
      hasError: false,
      showConfirmDeleteModal: false
    };
  }
  async componentWillMount() {
    // check if we need to create a new list
    if (!this.props.id && this.props.createList) {
      this.props.createList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentList.deletingIsLoading) {
      this.props.exitList('/profile');
    }
  }

  componentWillUnmount() {
    // reset any unsaved changes
    // for now we just reload users lists from backend
    // a client side undo mechanism would be more efficient
    this.props.loadLists();
  }
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
      id: currentList.id,
      [selector]: !currentList[selector]
    });
  }
  deleteList = () => {
    // this.props.removeList(this.props.currentList.id);
    alert('deleted');
  };
  render() {
    if (!this.props.currentList) {
      return null;
    }

    const isNew = this.props.currentList._created ? false : true;

    return (
      <div className="list-creator">
        <h1 className="list-creator__headline">
          {isNew ? 'Opret liste' : 'Redigér liste'}
        </h1>
        <div className="row">
          <div className="col-xs-8">
            <form className="mb4" onSubmit={e => this.onSubmit(e)}>
              <ListDetails
                id={this.props.currentList.id}
                hasError={this.state.hasError}
                title={this.props.currentList.title}
                description={this.props.currentList.description}
                onChange={e => this.onChange(e)}
                addImage={this.props.addImage}
                image={this.props.currentList.image}
                imageError={this.props.currentList.imageError}
                imageIsLoading={this.props.currentList.imageIsLoading}
                template={this.props.currentList.template}
              />
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
                onClick={this.props.confirmDeleteModal}
              >
                {isNew ? (
                  ''
                ) : this.props.currentList.deletingIsLoading ? (
                  <span>
                    <Spinner size="12px" />{' '}
                    <span className="text-danger"> | </span>
                  </span>
                ) : (
                  'Slet liste | '
                )}
              </span>
              <Link href="/profile" replace={true}>
                {isNew
                  ? 'Fortryd oprettelse af liste'
                  : 'Fortryd redigering af liste'}
              </Link>
            </form>
          </div>
          <div className="col-xs-4" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentList: getListById(state.listReducer, ownProps.id)
  };
};
export const mapDispatchToProps = dispatch => ({
  addImage: (id, image) => dispatch({type: ADD_LIST_IMAGE, image, id}),
  updateList: data => dispatch(updateList(data)),
  removeList: id => dispatch(removeList(id)),
  storeList: async list => {
    await dispatch(storeList(list.id));
    dispatch({type: HISTORY_REPLACE, path: '/profile'});
  },
  exitList: path => dispatch({type: HISTORY_REPLACE, path: path}),
  addElementToList: (book, id) => dispatch(addElementToList(book, id)),
  removeElementFromList: (book, id) =>
    dispatch(removeElementFromList(book, id)),
  loadLists: () => dispatch({type: LIST_LOAD_REQUEST}),
  createList: async () => {
    const {id} = await saveList({});
    dispatch(addList({id}));
    dispatch({
      type: HISTORY_REPLACE,
      path: `/lister/${id}/rediger`
    });
  },
  confirmDeleteModal: () => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: 'Skal denne liste slettes?',
        reason: 'Er du sikker på du vil slette den valgte liste.',
        confirmText: 'Slet liste',
        onConfirm: '',
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
export default connect(mapStateToProps, mapDispatchToProps)(ListCreator);
