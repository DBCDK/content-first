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
  ADD_LIST_IMAGE
} from '../../redux/list.reducer';
import {createListLocation} from '../../utils/requestLists';
import DragableList from './ListDrag.component';
import Textarea from 'react-textarea-autosize';
import {HISTORY_REPLACE} from '../../redux/middleware';
import BookSearchSuggester from './BookSearchSuggester';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';
import ImageUpload from '../general/ImageUpload.component';
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

const ListItem = ({item, onChange}) => (
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
      onSubmit={book => props.addElementToList(book, props.list.data.id)}
    />
    <DragableList
      list={props.list.data.list}
      renderListItem={ListItem}
      onUpdate={updatedList => {
        props.updateList({...props.list.data, list: updatedList});
      }}
      onRemove={book => props.removeElementFromList(book, props.list.data.id)}
    />
  </div>
);

export class ListCreator extends React.Component {
  constructor() {
    super();
    this.state = {
      hasError: false
    };
  }
  async componentWillMount() {
    // check if we need to create a new list
    if (!this.props.id && this.props.createList) {
      this.props.createList();
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
    if (!this.props.currentList.data.title) {
      this.setState({hasError: true});
      window.scrollTo(0, 0);
      return;
    }
    await this.props.storeList(this.props.currentList);
  }
  onChange(currentList) {
    this.props.updateList({...this.props.currentList.data, ...currentList});
  }
  setStatus() {
    const currentList = this.props.currentList;
    this.props.updateList({
      id: currentList.data.id,
      public: !currentList.data.public
    });
  }
  render() {
    if (!this.props.currentList) {
      return null;
    }
    const isNew = this.props.currentList.data.created_epoch ? false : true;
    return (
      <div className="list-creator">
        <h1 className="list-creator__headline">
          {isNew ? 'Opret liste' : 'Redigér liste'}
        </h1>
        <div className="row">
          <div className="col-xs-8">
            <form className="mb4" onSubmit={e => this.onSubmit(e)}>
              <ListDetails
                id={this.props.currentList.data.id}
                hasError={this.state.hasError}
                title={this.props.currentList.data.title}
                description={this.props.currentList.data.description}
                onChange={e => this.onChange(e)}
                addImage={this.props.addImage}
                image={this.props.currentList.data.image}
                imageError={this.props.currentList.data.imageError}
                imageIsLoading={this.props.currentList.data.imageIsLoading}
                template={this.props.currentList.data.template}
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
              <div className="list-creator__publication">
                <label htmlFor="public">
                  <input
                    id="public"
                    name="public"
                    type="checkbox"
                    checked={this.props.currentList.data.public || false}
                    onClick={() => this.setStatus()}
                  />
                  <span /> Skal listen være offentlig?
                </label>
              </div>
              <div className="list-creator__submit text-right">
                <button className="btn btn-primary" type="submit">
                  Gem liste
                </button>
              </div>
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
  storeList: async list => {
    await dispatch(storeList(list.data.id));
    dispatch({type: HISTORY_REPLACE, path: '/lister'});
  },
  addElementToList: (book, id) => dispatch(addElementToList(book, id)),
  removeElementFromList: (book, id) =>
    dispatch(removeElementFromList(book, id)),
  loadLists: () => dispatch({type: LIST_LOAD_REQUEST}),
  createList: async () => {
    const {id} = await createListLocation();
    dispatch(addList({id}));
    dispatch({
      type: HISTORY_REPLACE,
      path: `/lister/${id}/rediger`
    });
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ListCreator);
