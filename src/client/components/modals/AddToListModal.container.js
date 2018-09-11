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
import ToastMessage from '../base/ToastMessage';
import {toast} from 'react-toastify';

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
        this.addElementsToList(this.props.customLists[0]._id);
        this.setState({loadingList: false});
      }
    }
  }

  addElementsToList(listId) {
    if (this.props.works) {
      this.props.works.forEach(work =>
        this.props.addElementToList(
          {book: work.book, description: work.origin || '...'},
          listId
        )
      );
    }
    this.props.storeList(listId);
    this.close();
  }

  close = () => {
    this.setState(Object.assign({}, defaultState));
    this.props.modal(CLOSE_MODAL, 'addToList');
  };

  onDone = () => {
    let listName = '';
    let count = this.props.works.length || 0;

    // List does not exist - create it before adding
    if (this.state.listName) {
      listName = this.state.listName;
      this.onAddList(this.state.listName);
      this.setState({
        loadingList: true
      });

      // List exist - add to existing list
    } else {
      listName = this.state.list.title;
      this.addElementsToList(this.state.latestUsedId);
    }

    // clear if any callback given
    if (this.props.clearShortList) {
      this.props.clearShortList();
    }

    toast(
      <ToastMessage
        type="success"
        icon="check_circle"
        lines={[count + ' bøger tilføjet til listen ' + listName]}
      />
    );
  };

  onAddList = title => {
    this.props.addList(title);
  };

  render() {
    return (
      <Modal
        className="add-to-list--modal p-4"
        header={'GEM I LISTE'}
        onClose={this.close}
        onDone={this.onDone}
        doneText="JA TAK, GEM NU"
        doneDisabled={this.state.list || this.state.listName ? false : true}
      >
        <div className="row">
          <strong className="col-12">Hvilken liste vil du gemme i?</strong>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="list-overview" ref={e => (this.listsContainer = e)}>
              {this.props.customLists.map((l, i) => {
                return (
                  <div key={l._id}>
                    <input
                      id={'radio' + '-' + l.title + '-' + i}
                      ref={
                        this.state.latestUsedId === l._id &&
                        !this.state.listName
                          ? e => (this.checked = e)
                          : ''
                      }
                      type="radio"
                      name="list"
                      checked={
                        this.state.latestUsedId === l._id &&
                        !this.state.listName
                      }
                      onChange={() =>
                        this.setState({list: l, latestUsedId: l._id})
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
                  <div key={l._id}>
                    <input
                      id={'radio' + '-' + l.title + '-' + i}
                      ref={
                        this.state.latestUsedId === l._id &&
                        !this.state.listName
                          ? e => (this.checked = e)
                          : ''
                      }
                      type="radio"
                      name="list"
                      checked={
                        this.state.latestUsedId === l._id &&
                        !this.state.listName
                      }
                      onChange={() =>
                        this.setState({list: l, latestUsedId: l._id})
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
                  className={`add-list--btn text-center ${
                    !this.state.listName ? 'd-none' : 'button'
                  }`}
                  value="×"
                  type={'button'}
                  onClick={() => {
                    this.setState({listName: ''});
                  }}
                />
              </form>
            </div>
          </div>
          <div className="col-6">
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
  const customLists = getListsForOwner(state, {
    type: CUSTOM_LIST,
    owner: state.userReducer.openplatformId
  }).sort(function(a, b) {
    return b._created - a._created;
  });
  return {
    customLists: customLists,
    clearShortList: state.modalReducer.addToList.callback || null,
    systemLists: getListsForOwner(state, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    latestUsedId: state.listReducer.latestUsedId
      ? state.listReducer.latestUsedId
      : customLists[0]
        ? customLists[0]._id
        : ''
  };
};

export const mapDispatchToProps = dispatch => ({
  addElementToList: (book, listId) => dispatch(addElementToList(book, listId)),
  storeList: listId => dispatch(storeList(listId)),
  modal: (type, modal) => dispatch({type, modal}),
  addList: title => dispatch(addList({title}))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToListModal);
