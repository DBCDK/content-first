import React from 'react';
import {connect} from 'react-redux';
import {LIST_LOAD_REQUEST, addElementToList, removeElementFromList, updateList, storeList, getListById, addList} from '../../redux/list.reducer';
import {createListLocation} from '../../utils/requestLists';
import DragableList from './ListDrag.component';
import Textarea from 'react-textarea-autosize';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import BookSearchSuggester from './BookSearchSuggester';
import BookCover from '../general/BookCover.component';

const ListDetails = ({title, description, hasError, onChange}) => (
  <div className="list-details">
    <div className="form-group">
      <span className={`required ${!title && hasError ? 'has-error' : ''}`}>
        <input className="form-control" type="text" name="list-title" placeholder="Giv din liste en titel" onChange={e => onChange({title: e.currentTarget.value})} value={title} />
        {!title && hasError ? <div className="alert alert-danger">Din liste skal have en titel</div> : ''}
      </span>
      <Textarea
        className="form-control list-details__description"
        name="list-description"
        placeholder="Skriv lidt om din liste"
        onChange={e => onChange({description: e.currentTarget.value})}
        value={description}
      />
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

const ListBooks = ({list, dispatch}) => (
  <div className="list-drag">
    <BookSearchSuggester list={list} onSubmit={book => dispatch(addElementToList(book, list.data.id))} />
    <DragableList
      list={list.data.list}
      renderListItem={ListItem}
      onUpdate={updatedList => dispatch(updateList({id: list.data.id, list: updatedList}))}
      onRemove={item => dispatch(removeElementFromList(item, list.data.id))}
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
    if (!this.props.id && this.props.fetchListId) {
      const {id} = await this.props.fetchListId();
      this.props.dispatch(addList({id}));
      this.props.dispatch({type: HISTORY_REPLACE, path: `/lister/${id}/rediger`});
    }
  }
  componentWillUnmount() {
    // reset any unsaved changes
    // for now we just reload users lists from backend
    // a client side undo mechanism would be more efficient
    this.props.dispatch({type: LIST_LOAD_REQUEST});
  }
  async onSubmit(e) {
    e.preventDefault();
    if (!this.props.currentList.data.title) {
      this.setState({hasError: true});
      window.scrollTo(0, 0);
      return;
    }
    await this.props.dispatch(storeList(this.props.currentList.data.id));

    this.props.dispatch({type: HISTORY_PUSH, path: '/lister'});
  }
  onChange(currentList) {
    this.props.dispatch(updateList({...this.props.currentList.data, ...currentList}));
  }
  setStatus() {
    const currentList = this.props.currentList;
    this.props.dispatch(updateList({id: currentList.data.id, public: !currentList.data.public}));
  }
  render() {
    if (!this.props.currentList) {
      return null;
    }
    return (
      <div className="list-creator">
        <h1 className="list-creator__headline">Opret liste</h1>
        <div className="row">
          <div className="col-xs-8">
            <form className="mb4" onSubmit={e => this.onSubmit(e)}>
              <ListDetails
                hasError={this.state.hasError}
                title={this.props.currentList.data.title}
                description={this.props.currentList.data.description}
                onChange={e => this.onChange(e)}
              />
              <h2 className="list-creator__headline">Tilføj bøger til listen</h2>
              <ListBooks dispatch={this.props.dispatch} list={this.props.currentList} />
              <div className="list-creator__publication">
                <label htmlFor="public">
                  <input id="public" name="public" type="checkbox" checked={this.props.currentList.data.public || false} onClick={() => this.setStatus()} />
                  <span /> Skal listen være offentlig?
                </label>
              </div>
              <div className="list-creator__submit text-right">
                <button className="btn btn-primary" type="submit">
                  Gem liste
                </button>
              </div>
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
    currentList: getListById(state.listReducer, ownProps.id),
    fetchListId: createListLocation
  };
};
export default connect(mapStateToProps)(ListCreator);
