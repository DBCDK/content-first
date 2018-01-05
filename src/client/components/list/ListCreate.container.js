import React from 'react';
import {connect} from 'react-redux';
import {
  ADD_ELEMENT_TO_LIST,
  UPDATE_CURRENT_LIST,
  REMOVE_ELEMENT_FROM_LIST,
  ADD_LIST,
  LIST_LOAD_REQUEST,
  CLEAR_CURRENT_LIST
} from '../../redux/list.reducer';
import DragableList from './ListDrag.component';
import Textarea from 'react-textarea-autosize';
import {HISTORY_PUSH} from '../../redux/middleware';
import BookSearchSuggester from './BookSearchSuggester';
import BookCover from '../general/BookCover.component';

const ListDetails = ({title, description, hasError, onChange}) => (
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
    <BookSearchSuggester
      list={list}
      onSubmit={book => dispatch({type: ADD_ELEMENT_TO_LIST, element: book})}
    />
    <DragableList
      list={list}
      renderListItem={ListItem}
      onUpdate={updatedList =>
        dispatch({
          type: UPDATE_CURRENT_LIST,
          currentList: {list: updatedList}
        })
      }
      onRemove={item =>
        dispatch({type: REMOVE_ELEMENT_FROM_LIST, element: item})
      }
    />
  </div>
);

class ListCreator extends React.Component {
  constructor() {
    super();
    this.state = {
      hasError: false
    };
  }
  componentDidMount() {
    if (this.props.id) {
      // gotta load existing list
      this.props.dispatch({type: LIST_LOAD_REQUEST, id: this.props.id});
    } else {
      // this is a new list, so clear current list
      this.props.dispatch({type: CLEAR_CURRENT_LIST});
    }
  }
  async onSubmit(e) {
    e.preventDefault();
    if (!this.props.listState.currentList.title) {
      this.setState({hasError: true});
      window.scrollTo(0, 0);
      return;
    }
    await this.props.dispatch({
      type: ADD_LIST,
      list: this.props.listState.currentList,
      clearCurrentList: true
    });

    this.props.dispatch({type: HISTORY_PUSH, path: '/lister'});
  }
  onChange(currentList) {
    this.props.dispatch({type: UPDATE_CURRENT_LIST, currentList});
  }
  setStatus() {
    const currentList = this.props.listState.currentList;
    currentList.public = !currentList.public;
    this.props.dispatch({type: UPDATE_CURRENT_LIST, currentList});
  }
  render() {
    return (
      <div className="list-creator">
        <h1 className="list-creator__headline">Opret liste</h1>
        <div className="row">
          <div className="col-xs-8">
            <form className="mb4" onSubmit={e => this.onSubmit(e)}>
              <ListDetails
                hasError={this.state.hasError}
                title={this.props.listState.currentList.title}
                description={this.props.listState.currentList.description}
                onChange={e => this.onChange(e)}
              />
              <h2 className="list-creator__headline">
                Tilføj bøger til listen
              </h2>
              <ListBooks
                dispatch={this.props.dispatch}
                list={
                  this.props.listState.currentList
                    ? this.props.listState.currentList.list
                    : []
                }
              />
              <div className="list-creator__publication">
                <label htmlFor="public">
                  <input
                    id="public"
                    name="public"
                    type="checkbox"
                    checked={this.props.listState.currentList.public || false}
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
            </form>
          </div>
          <div className="col-xs-4" />
        </div>
      </div>
    );
  }
}

export default connect(
  // Map redux state to props
  state => {
    return {listState: state.listReducer};
  }
)(ListCreator);
