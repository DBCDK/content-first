import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';
import {
  CUSTOM_LIST,
  getLists,
  addList,
  addElementToList,
  storeList
} from '../../redux/list.reducer';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import _ from 'lodash';
const defaultState = {
  comment: '',
  list: '',
  listName: ''
};

class AddToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      list: this.props.customLists[0] || null
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customLists.length < this.props.customLists.length) {
      // list has just been added, lets scroll down and select it
      this.listsContainer.scrollTop = this.listsContainer.scrollHeight;
      this.setState({
        list: this.props.customLists[this.props.customLists.length - 1]
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
        this.props.dispatch(
          addElementToList(
            {book: work.book, description: work.origin || ''},
            this.state.list.data.id
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
          this.state.list.data.id
        )
      );
    }
    this.props.dispatch(storeList(this.state.list.data.id));
    this.close();
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
      >
        <div className="row">
          <strong className="col-xs-12">Hvilken liste vil du gemme i?</strong>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="list-overview" ref={e => (this.listsContainer = e)}>
              {this.props.customLists.map(l => {
                return (
                  <div key={l.data.id}>
                    <input
                      type="radio"
                      name="list"
                      checked={_.get(this.state, 'list.data.id') === l.data.id}
                      onChange={() => this.setState({list: l})}
                    />
                    {l.data.title}
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
              } ${this.props.works.length > 1 ? 'bøger' : 'bog'} i '${_.get(
                this.state,
                'list.data.title'
              )}'`}</p>
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
  return {
    customLists: getLists(state.listReducer, {
      type: CUSTOM_LIST,
      owner: state.userReducer.openplatformId
    })
  };
};
export default connect(mapStateToProps)(AddToListModal);
