import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';
import {
  CUSTOM_LIST,
  SYSTEM_LIST,
  getListsForOwner,
  addList,
  addElementToList,
  storeList
} from '../../redux/list.reducer';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
const defaultState = {
  comment: '',
  list: '',
  listName: ''
};

export class AddToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      list: this.props.customLists[0] || null,
      latestUsedId: this.props.latestUsedId,
      loadingList: false
    });
  }

  componentDidMount() {
    if (this.checked) {
      // Autoscroll to previous selected list - but remain a distance of 2 list items (and 20px padding) from the top of the list div
      const fromTop = 2 * this.checked.parentElement.offsetHeight + 20;
      this.listsContainer.scrollTop =
        this.checked.parentElement.offsetTop - fromTop;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customLists.length < this.props.customLists.length) {
      this.setState({
        list: this.props.customLists[this.props.customLists.length - 1]
      });
      // if loadingList is true - add book/books to auto-created list
      if (this.state.loadingList) {
        this.addElementsToList(this.props.customLists[0].id);
        this.setState({loadingList: false});
      }
    }
  }

  addElementsToList(listId) {
    if (this.props.works) {
      this.props.works.forEach(work =>
        this.props.dispatch(
          addElementToList(
            {book: work.book, description: work.origin || ''},
            listId
          )
        )
      );
    } else {
      this.props.dispatch(
        addElementToList(
          {
            book: this.props.work.book,
            description: this.state.comment || this.props.work.origin || ''
          },
          listId
        )
      );
    }
    this.props.dispatch(storeList(listId));
    this.close();
  }

  close = () => {
    this.setState(Object.assign({}, defaultState));
    this.props.dispatch({type: CLOSE_MODAL, modal: 'addToList'});
  };
  onDone = () => {
    // If the "create-new-list" field is NOT empty - auto-create new list
    if (this.state.listName) {
      this.onAddList(this.state.listName);
      this.setState({
        loadingList: true
      });
    } else {
      this.addElementsToList(this.state.latestUsedId);
    }
  };

  onAddList = title => {
    this.props.dispatch(addList({title}));
  };

  render() {
    return (
      <Modal
        className="add-to-list--modal"
        header={'GEM I LISTE'}
        onClose={this.close}
        onDone={this.onDone}
        doneText="JA TAK, GEM NU"
        doneDisabled={this.state.list || this.state.listName ? false : true}
      >
        <div className="row">
          <strong className="col-xs-12">Hvilken liste vil du gemme i?</strong>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="list-overview" ref={e => (this.listsContainer = e)}>
              {this.props.customLists.map((l, i) => {
                return (
                  <div key={l.id}>
                    <input
                      id={'radio' + '-' + l.title + '-' + i}
                      ref={
                        this.state.latestUsedId === l.id && !this.state.listName
                          ? e => (this.checked = e)
                          : ''
                      }
                      type="radio"
                      name="list"
                      checked={
                        this.state.latestUsedId === l.id && !this.state.listName
                      }
                      onChange={() =>
                        this.setState({list: l, latestUsedId: l.id})
                      }
                    />
                    <label htmlFor={'radio' + '-' + l.title + '-' + i}>
                      {l.title}
                    </label>
                  </div>
                );
              })}

              {this.props.customLists.length > 0 ? <hr /> : ''}

              {this.props.systemLists.map((l, i) => {
                return (
                  <div key={l.id}>
                    <input
                      id={'radio' + '-' + l.title + '-' + i}
                      ref={
                        this.state.latestUsedId === l.id && !this.state.listName
                          ? e => (this.checked = e)
                          : ''
                      }
                      type="radio"
                      name="list"
                      checked={
                        this.state.latestUsedId === l.id && !this.state.listName
                      }
                      onChange={() =>
                        this.setState({list: l, latestUsedId: l.id})
                      }
                    />
                    <label htmlFor={'radio' + '-' + l.title + '-' + i}>
                      {l.title}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="add-list">
              <form
                onSubmit={e => {
                  if (this.state.listName) {
                    this.setState({listName: ''});
                    this.onDone();
                  }
                  e.preventDefault();
                }}
              >
                <input
                  className=""
                  type="text"
                  name="add-list"
                  placeholder="Opret ny liste"
                  value={this.state.listName}
                  onChange={e => this.setState({listName: e.target.value})}
                />
                <input
                  className="add-list--btn text-center"
                  value="×"
                  type={`${!this.state.listName ? 'hidden' : 'button'}`}
                  onClick={() => {
                    this.setState({listName: ''});
                  }}
                />
              </form>
            </div>
          </div>
          <div className="col-xs-6">
            {this.props.works && (
              <p className="mt2">{`Du er ved at gemme ${
                this.props.works.length
              } ${this.props.works.length > 1 ? 'bøger' : 'bog'}`}</p>
            )}
            {this.props.work && [
              <WorkItemSmall key="item" work={this.props.work} />,
              <textarea
                key="textarea"
                className="comment"
                placeholder={
                  this.props.work.origin || 'Skriv evt. en kommentar til bogen'
                }
                value={this.state.comment}
                onChange={e => this.setState({comment: e.target.value})}
              />
            ]}
          </div>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = state => {
  const customLists = getListsForOwner(state.listReducer, {
    type: CUSTOM_LIST,
    owner: state.userReducer.openplatformId
  }).sort(function(a, b) {
    return b._created - a._created;
  });
  return {
    customLists: customLists,
    systemLists: getListsForOwner(state.listReducer, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    latestUsedId: state.listReducer.latestUsedId
      ? state.listReducer.latestUsedId
      : customLists[0] ? customLists[0].id : ''
  };
};

export default connect(mapStateToProps)(AddToListModal);
