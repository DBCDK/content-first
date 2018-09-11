import React from 'react';
import {connect} from 'react-redux';

import ProfileImage from '../../general/ProfileImage.component';
import textParser from '../../../utils/textParser';
import Comments from '../../comments/Comment.container';
import CommentInput from '../../comments/CommentInput.component';
import timeToString from '../../../utils/timeToString';
import Heading from '../../base/Heading';
import Paragraph from '../../base/Paragraph';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import WorkRow from '../../work/WorkRow';
import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  storeList
} from '../../../redux/list.reducer';

const ElementContextMenu = ({onDelete, onEdit}) => (
  <ContextMenu
    className="mr-1 mt-2 position-absolute"
    style={{right: 0, top: 0}}
  >
    <ContextMenuAction title="Redigér indlæg" icon="edit" onClick={onEdit} />
    <ContextMenuAction title="Slet indlæg" icon="clear" onClick={onDelete} />
  </ContextMenu>
);

export class ListElement extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editing: props.editing || false,
      originalDescription: props.element.description
    };
  }
  render() {
    const {
      element,
      owner,
      list,
      isOwner,
      removeElement,
      updateElement,
      submit,
      showContextMenu = true,
      showComments = true,
      children
    } = this.props;
    return (
      <div className="mt-2 mt-md-4 lys-graa box-shadow position-relative">
        {isOwner &&
          showContextMenu && (
            <ElementContextMenu
              onDelete={() => removeElement(element, list)}
              onEdit={() => this.setState({editing: true})}
            />
          )}
        <div className="p-4">
          <div className="d-flex flex-row">
            <ProfileImage user={owner} size={'40'} namePosition={'right'} />
            <Heading
              tag="h5"
              type="title"
              className="ml-4 due-txt"
              style={{fontWeight: 400}}
            >
              {timeToString(element._created)}
            </Heading>
          </div>
          <WorkRow
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
              onSubmit={() => {
                this.setState({
                  editing: false,
                  originalDescription: element.description
                });
                submit(list);
              }}
              onCancel={() => {
                this.setState({editing: false});
                updateElement(
                  {...element, description: this.state.originalDescription},
                  list
                );
              }}
              onChange={description => {
                updateElement({...element, description}, list);
              }}
              disabled={false}
              error={null}
              placeholder="Fortæl om bogen"
            />
          ) : (
            <Paragraph className="mt-3">
              <span
                dangerouslySetInnerHTML={{
                  __html: textParser(
                    element.description || element.book.description || ''
                  )
                }}
              />
            </Paragraph>
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
    owner: state.users.toJS()[ownProps.element._owner],
    isOwner: state.userReducer.openplatformId === ownProps.element._owner
  };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  removeElement: async (element, list) => {
    await dispatch(removeElementFromList(element, list._id));
    dispatch(storeList(list._id));
  },
  updateElement:
    ownProps.updateElement ||
    ((element, list) => {
      dispatch({type: UPDATE_LIST_ELEMENT, _id: list._id, element});
    }),
  submit: ownProps.submit || (list => dispatch(storeList(list._id)))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListElement);
