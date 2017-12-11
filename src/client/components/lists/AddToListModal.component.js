import React from 'react';
import Modal from '../general/Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';

const defaultState = {
  comment: '',
  list: ''
};

class AddToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }
  render() {
    const lists = [
      {id: 1, name: 'Julefavoritter'},
      {id: 2, name: 'Idéer til gaver'},
      {id: 3, name: 'hest1'},
      {id: 4, name: 'hest1'},
      {id: 5, name: 'hest1'},
      {id: 6, name: 'hest1'},
      {id: 7, name: 'hest1'},
      {id: 8, name: 'hest1'},
      {id: 9, name: 'hest1'},
      {id: 10, name: 'hest1'},
      {id: 11, name: 'hest1'},
      {id: 12, name: 'hest1'},
      {id: 13, name: 'hest1'}
    ];
    return (
      <Modal
        className="add-to-list--modal"
        show={this.props.show}
        header={'GEM I LISTE'}
        onClose={this.props.onClose}
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
              {lists.map(l => {
                return <div>
                  <input
                    type="radio"
                    name="list"
                    checked={this.state.list.id === l.id}
                    onChange={() => this.setState({list: l})} />{l.name}
                </div>;
              })}
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
