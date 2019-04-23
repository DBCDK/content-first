import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal.component';
import Text from '../base/Text';
import Button from '../base/Button';
import Icon from '../base/Icon';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {
  updateList,
  storeList,
  getListByIdSelector
} from '../../redux/list.reducer';
const getListById = getListByIdSelector();
const CheckBoxButton = ({
  checked,
  children,
  onClick,
  className,
  disabled = false
}) => (
  <Button
    onClick={onClick}
    className={className}
    size="medium"
    type="link2"
    style={{fontWeight: 400}}
    disabled={disabled}
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
      template: props.list.template || 'list',
      public: props.list.public || false,
      social: props.list.social || false,
      open: props.list.open || false
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
            template: this.state.template,
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
        <Text type="large" className="mt-4">
          Hvordan skal listen vises?
        </Text>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.template === 'list'}
            onClick={() => {
              this.setState({template: 'list'});
            }}
          >
            Vis som liste
          </CheckBoxButton>
        </div>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.template === 'bookcase'}
            onClick={() => {
              let template = {template: 'bookcase'};
              if (!list.image) {
                template = {
                  ...template,
                  public: false,
                  social: false,
                  open: false
                };
              }
              this.setState({...template});
            }}
          >
            Vis som bogreol
          </CheckBoxButton>
        </div>

        <hr />

        <Text type="large" className="mt-4">
          Hvad må andre brugere på listen?
        </Text>
        <div>
          <CheckBoxButton
            className="mt-2"
            checked={this.state.public}
            disabled={!list.image && this.state.template === 'bookcase'}
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
            disabled={!list.image && this.state.template === 'bookcase'}
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
            disabled={!list.image && this.state.template === 'bookcase'}
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
        <div className="mt1">
          {!list.image &&
            this.state.template === 'bookcase' && (
              <Text type="body" variant="color-fersken">
                Tilføj et billede til listen for at andre kan se den som
                bogreol.
              </Text>
            )}
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
