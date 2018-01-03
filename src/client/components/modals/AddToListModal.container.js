import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';
import {
  SYSTEM_LIST,
  ADD_ELEMENT_TO_LIST,
  ADD_LIST
} from '../../redux/list.reducer';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
const defaultState = {
  comment: '',
  list: '',
  listName: ''
};

class AddToListModal extends React.Component {
  static defaultProps = {
    show: true
  };
  constructor(props) {
    super(props);
    const customLists = this.props.listState.lists.filter(
      l => l.type !== SYSTEM_LIST
    );
    this.state = Object.assign({}, defaultState, {list: customLists[0] || ''});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listState.lists.length < this.props.listState.lists.length) {
      // list has just been added, lets scroll down and select it
      this.listsContainer.scrollTop = this.listsContainer.scrollHeight;
      this.setState({
        list: this.props.listState.lists[this.props.listState.lists.length - 1]
      });
    }
  }
  close = () => {
    this.setState(Object.assign({}, defaultState));
    this.props.dispatch({type: CLOSE_MODAL, modal: 'addToList'});
  };
  onDone = () => {
    if (this.props.works) {
      this.props.works.forEach(work =>
        this.props.dispatch({
          type: ADD_ELEMENT_TO_LIST,
          id: this.state.list.id,
          element: work,
          description: work.origin || ''
        })
      );
    } else {
      this.props.dispatch({
        type: ADD_ELEMENT_TO_LIST,
        id: this.state.list.id,
        element: this.props.work,
        description: this.state.comment || this.props.work.origin || ''
      });
    }
    this.close();
  };
  onAddList = listName =>
    this.props.dispatch({
      type: ADD_LIST,
      list: {title: listName, list: []}
    });

  render() {
    const customLists = this.props.listState.lists.filter(
      l => l.type !== SYSTEM_LIST
    );
    return (
      <Modal
        className="add-to-list--modal"
        show={this.props.show}
        header={'GEM I LISTE'}
        onClose={this.close}
        onDone={this.onDone}
        doneText="JA TAK, GEM NU"
      >
        <div className="row">
          <strong className="col-xs-12">Hvilken liste vil du gemme i?</strong>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="list-overview" ref={e => (this.listsContainer = e)}>
              {customLists.map(l => {
                return (
                  <div key={l.id}>
                    <input
                      type="radio"
                      name="list"
                      checked={this.state.list.id === l.id}
                      onChange={() => this.setState({list: l})}
                    />
                    {l.title}
                  </div>
                );
              })}
            </div>
            <div className="add-list">
              <form
                onSubmit={e => {
                  if (this.state.listName) {
                    this.onAddList(this.state.listName);
                    this.setState({listName: ''});
                  }
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  name="add-list"
                  placeholder="Opret ny liste"
                  value={this.state.listName}
                  onChange={e => this.setState({listName: e.target.value})}
                />
                <input
                  className="add-list--btn text-center"
                  type="submit"
                  value="+"
                />
              </form>
            </div>
          </div>
          <div className="col-xs-6">
            {this.props.works && (
              <p className="mt2">{`Du er ved at gemme ${
                this.props.works.length
              } ${this.props.works.length > 1 ? 'bøger' : 'bog'} i '${
                this.state.list.title
              }'`}</p>
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
export default connect(state => {
  return {
    listState: state.listReducer
  };
})(AddToListModal);
