import React from 'react';
import Modal from '../general/Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';
import {SYSTEM_LIST} from '../../redux/list.reducer';

const defaultState = {
  comment: '',
  list: '',
  listName: ''
};

class AddToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }

  render() {
    const customLists = this.props.lists.filter(l => l.type !== SYSTEM_LIST);

    return (
      <Modal
        className="add-to-list--modal"
        show={this.props.show}
        header={'GEM I LISTE'}
        onClose={() => {
          this.props.onClose();
          this.setState(Object.assign({}, defaultState));
        }}
        onDone={() => {
          this.props.onDone(this.props.work, this.state.comment, this.state.list);
          this.setState(Object.assign({}, defaultState));
        }}
        doneText="JA TAK, GEM NU">
        <div className="row">
          <strong className="col-xs-12">Hvilken liste vil du gemme i?</strong>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="list-overview">
              {customLists.map(l => {
                return <div key={l.id}>
                  <input
                    type="radio"
                    name="list"
                    checked={this.state.list.id === l.id}
                    onChange={() => this.setState({list: l})} />{l.title}
                </div>;
              })}
            </div>
            <div className="add-list">
              <form
                onSubmit={e => {
                  if (this.state.listName) {
                    this.props.onAddList(this.state.listName);
                    this.setState({listName: ''});
                  }
                  e.preventDefault();
                }}>
                <input
                  type="text"
                  name="add-list"
                  placeholder="Opret ny liste"
                  value={this.state.listName}
                  onChange={e => this.setState({listName: e.target.value})}/>
                <input className="add-list--btn text-center" type="submit" value="+" />
              </form>
            </div>
          </div>
          <div className="col-xs-6">
            {this.props.work && <WorkItemSmall work={this.props.work}/>}
            <textarea
              className="comment"
              placeholder="Skriv evt. en kommentar til bogen"
              value={this.state.comment}
              onChange={(e) => this.setState({comment: e.target.value})}>
            </textarea>
          </div>
        </div>

      </Modal>
    );
  }
}
export default AddToListModal;
