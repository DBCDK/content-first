import React from 'react';
import {connect} from 'react-redux';
import {
  updateList,
  storeList,
  removeList,
  getListByIdSelector
} from '../../../redux/list.reducer';
import Button from '../../base/Button';
import T from '../../base/T';
import {HISTORY_REPLACE} from '../../../redux/middleware';
const getListById = getListByIdSelector();

class StickyConfirmPanel extends React.Component {
  constructor(props) {
    super();
    this.state = {originalList: props.list};
  }
  componentDidUpdate(prevProps) {
    if (prevProps.list._id !== this.props.list._id) {
      this.setState({originalList: this.props.list});
    }
  }
  cancel = () => {
    if (this.props.isNew) {
      this.props.deleteList();
      this.props.exitList();
    } else {
      this.props.cancel(this.state.originalList);
    }
  };
  submit = () => {
    if (this.props.list.title && this.props.list.title.trim()) {
      this.props.submit();
      this.setState({originalList: this.props.list});
      this.props.onTitleMissing(false);
    } else {
      this.props.onTitleMissing(true);
    }
  };
  render() {
    const {editing, isNew, isOwner} = this.props;
    if ((!editing && !isNew) || !isOwner) {
      return null;
    }
    return (
      <div
        className="fixed-bottom d-flex justify-content-center porcelain box-shadow-top"
        style={{}}
      >
        <div
          className="fixed-width-col-sm d-xs-none d-xl-block"
          style={{display: 'none'}}
        />
        <div className="list-container fixed-width-col-md m4">
          <div className="EditPanel d-flex flex-row justify-content-end">
            <Button
              type="link"
              size="medium"
              className="mr-2 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
              onClick={this.cancel}
            >
              {isNew ? (
                <T component="list" name={'cancelList'} />
              ) : (
                <T component="general" name="cancel" />
              )}
            </Button>
            <Button
              type="quaternary"
              className="mr-4 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
              onClick={this.submit}
              dataCy="stickyPanel-submit"
            >
              {isNew ? (
                <T component="list" name="saveList" />
              ) : (
                <T component="general" name="saveChanges" />
              )}
            </Button>
          </div>
        </div>
        <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4" />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    isOwner: ownProps._id && list._owner === state.userReducer.openplatformId,
    list,
    editing: list.editing,
    isNew: list.isNew
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  cancel: originalList =>
    dispatch(updateList({...originalList, editing: false})),
  submit: () => {
    dispatch(updateList({_id: ownProps._id, editing: false, isNew: false}));
    dispatch(storeList(ownProps._id));
  },
  deleteList: () => dispatch(removeList(ownProps._id)),
  exitList: () => dispatch({type: HISTORY_REPLACE, path: '/profile'})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StickyConfirmPanel);
