import React from 'react';
import {connect} from 'react-redux';
import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  storeList
} from '../../../../redux/list.reducer';
import {getUser} from '../../../../redux/users';
import ProfileImage from '../../../general/ProfileImage.component';
import textParser from '../../../../utils/textParser';
import Comments from '../../../comments/Comment.container';
import CommentInput from '../../../comments/CommentInput.component';
import timeToString from '../../../../utils/timeToString';
import Text from '../../../base/Text';
import ContextMenu, {ContextMenuAction} from '../../../base/ContextMenu';
import WorkRowBookcase from '../../../work/WorkRowBookcase';

const ElementContextMenu = ({
  onDelete,
  onEdit,
  isElementOwner,
  isListOwner
}) => {
  if (!isListOwner && !isElementOwner) {
    return null;
  }
  return (
    <ContextMenu
      className="mr-0 mt-2 position-absolute"
      style={{right: 0, top: 0}}
    >
      {isElementOwner && (
        <ContextMenuAction
          title="Redigér indlæg"
          icon="edit"
          onClick={onEdit}
        />
      )}
      {(isElementOwner || isListOwner) && (
        <ContextMenuAction
          title="Slet indlæg"
          icon="clear"
          onClick={onDelete}
        />
      )}
    </ContextMenu>
  );
};

export class ListElement extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editing: props.editing || false,
      originalDescription: props.element.description
    };
  }
  submit = () => {
    const {submit, element} = this.props;
    this.setState({
      editing: false,
      originalDescription: element.description
    });
    submit();
  };
  cancel = () => {
    const {element, updateElement} = this.props;
    this.setState({editing: false});
    updateElement({...element, description: this.state.originalDescription});
  };
  updateDescription = description => {
    const {element, updateElement} = this.props;
    updateElement({...element, description});
  };
  deleteElement = () => {
    const {removeElement} = this.props;
    removeElement();
  };
  edit = () => this.setState({editing: true});
  render() {
    const {
      element,
      owner,
      list,
      isListOwner,
      isElementOwner,
      showContextMenu = true,
      showComments = true,
      children,
      elementRef
    } = this.props;
    return (
      <div
        ref={elementRef}
        className="mt-2 mt-md-4 lys-graa box-shadow position-relative"
      >
        {showContextMenu && (
          <ElementContextMenu
            onDelete={this.deleteElement}
            onEdit={this.edit}
            isElementOwner={isElementOwner}
            isListOwner={isListOwner}
          />
        )}
        <div className="px-3 py-4 p-sm-4">
          <div className="d-flex flex-row">
            <ProfileImage user={owner} size={'40'} namePosition={'right'} />
            <Text type="body" variant="color-due" className="ml-4">
              {timeToString(element._created)}
            </Text>
          </div>
          <WorkRowBookcase
            work={element}
            origin={`Fra "${list.title}"`}
            className="mt-4"
          />
          {this.state.editing ? (
            <CommentInput
              className="mt-3"
              hideProfile={true}
              autoFocus={true}
              user={owner}
              value={element.description}
              cancelText={
                this.state.originalDescription
                  ? 'Fortryd'
                  : 'Brug bogens beskrivelse'
              }
              onSubmit={this.submit}
              onCancel={this.cancel}
              onChange={this.updateDescription}
              disabled={false}
              error={null}
              placeholder="Fortæl om bogen"
            />
          ) : (
            <Text type="body" className="mt-3">
              <span
                dangerouslySetInnerHTML={{
                  __html: textParser(
                    element.description || element.book.description || ''
                  )
                }}
              />
            </Text>
          )}
        </div>
        {list.social &&
          showComments && (
            <Comments
              className="pl-4 pr-4 pt-4 pb-0 porcelain"
              id={element._id}
              disabled={this.state.editing}
            />
          )}
        {children}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    owner: getUser(state, {id: ownProps.element._owner}),
    isElementOwner:
      state.userReducer.openplatformId === ownProps.element._owner,
    isListOwner: state.userReducer.openplatformId === ownProps.list._owner
  };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  removeElement: async () => {
    await dispatch(removeElementFromList(ownProps.element, ownProps.list._id));
    dispatch(storeList(ownProps.list._id));
  },
  updateElement:
    ownProps.updateElement ||
    (element => {
      dispatch({
        type: UPDATE_LIST_ELEMENT,
        _id: ownProps.list._id,
        element
      });
    }),
  submit: ownProps.submit || (() => dispatch(storeList(ownProps.list._id)))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListElement);
