import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import Heading from '../base/Heading';
import Button from '../base/Button';
import Icon from '../base/Icon';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {
  updateList,
  storeList,
  getListByIdSelector
} from '../../redux/list.reducer';
const getListById = getListByIdSelector();
const CheckBoxButton = ({checked, children, onClick, className}) => (
  <Button
    onClick={onClick}
    className={className}
    size="medium"
    type="link2"
    style={{fontWeight: 400}}
  >
    {checked ? (
      <Icon
        name="check_circle"
        className="align-middle"
        style={{color: 'var(--de-york)'}}
      />
    ) : (
      <span
        className="align-middle"
        style={{
          display: 'inline-block',
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1px solid var(--silver-chalice)',
          margin: 2
        }}
      />
    )}

    <span className="align-middle ml-2">{children}</span>
  </Button>
);
export class ListSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public: props.list.public,
      social: props.list.social,
      open: props.list.open
    };
  }
  render() {
    const {list, updateListData, close, submit} = this.props;
    return (
      <Modal
        header="Indstillinger"
        onClose={this.props.close}
        onDone={() => {
          updateListData({
            _id: list._id,
            public: this.state.public,
            social: this.state.social,
            open: this.state.open
          });
          submit(list);
          close();
        }}
        doneText="Gem indstillinger"
        cancelText="Fortryd"
      >
        <Heading Tag="h2" type="title" className="mt-4">
          Hvad må andre brugere på listen?
        </Heading>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.public}
            onClick={() => {
              if (this.state.public) {
                this.setState({public: false, social: false, open: false});
              } else {
                this.setState({public: true});
              }
            }}
          >
            De må se den
          </CheckBoxButton>
        </div>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.social}
            onClick={() => {
              if (!this.state.social) {
                this.setState({social: true, public: true});
              } else {
                this.setState({social: false});
              }
            }}
          >
            De må kommentere
          </CheckBoxButton>
        </div>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.open}
            onClick={() => {
              if (!this.state.open) {
                this.setState({open: true, public: true});
              } else {
                this.setState({open: false});
              }
            }}
          >
            De må tilføje bøger
          </CheckBoxButton>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  list: getListById(state, {_id: ownProps.context._id})
});
const mapDispatchToProps = dispatch => ({
  submit: list => dispatch(storeList(list._id)),
  updateListData: data => dispatch(updateList(data)),
  close: () => dispatch({type: CLOSE_MODAL, modal: 'listSettings'})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSettingsModal);
