import React from 'react';
import {connect} from 'react-redux';
import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  storeList
} from '../../../redux/list.reducer';
import {getUser} from '../../../redux/users';
import Comments from '../../comments/Comment.container';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import {timestampToLongDate} from '../../../utils/dateTimeFormat';
import BookCover from '../../general/BookCover.component';
import textParser from '../../../utils/textParser';
import Link from '../../general/Link.component';
import BookmarkButton from '../../general/BookmarkButton';
import TaxDescription from '../../work/TaxDescription.component.js';
import CommentInput from '../../comments/CommentInput.component';

// User
const UserInfo = ({showUserInfo, owner, time}) => {
  if (!showUserInfo) {
    return false;
  }
  return (
    <div className="d-flex flex-column align-items-md-end pb-2">
      <Text type="small" variant="color-due">
        <T component={'general'} name="addedThe" />
        {` ${timestampToLongDate(time)}`}
      </Text>
      <Text type="body" variant="weight-semibold">
        {owner.name}
      </Text>
    </div>
  );
};

// Element menu
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
      style={{right: 0, bottom: 0}}
    >
      {isElementOwner && (
        <ContextMenuAction
          title={T({
            component: 'post',
            name: 'editDescription'
          })}
          icon="edit"
          onClick={onEdit}
        />
      )}
      {(isElementOwner || isListOwner) && (
        <ContextMenuAction
          title={T({
            component: 'post',
            name: 'deleteBook'
          })}
          icon="delete"
          onClick={onDelete}
        />
      )}
    </ContextMenu>
  );
};

const Description = ({
  showDescription,
  editing = false,
  owner,
  element,
  originalDescription,
  onSubmit,
  onCancel,
  onChange
}) => {
  if (!showDescription) {
    return null;
  }

  return showDescription && editing ? (
    <CommentInput
      className="mt-3 list-pr"
      hideProfile={true}
      autoFocus={true}
      user={owner}
      value={element.description}
      cancelText={
        originalDescription ? (
          <T component="general" name="cancel" />
        ) : (
          <T component="post" name="useBookDescription" />
        )
      }
      onSubmit={onSubmit}
      onCancel={onCancel}
      onChange={onChange}
      disabled={false}
      error={null}
      editing={true}
      placeholder={T({
        component: 'post',
        name: 'aboutTheBook'
      })}
    />
  ) : (
    showDescription && (
      <Text type="body" className="mt-3 mb-4 list-pr">
        <span
          dangerouslySetInnerHTML={{
            __html: textParser(
              element.description || element.book.description || ''
            )
          }}
        />
      </Text>
    )
  );
};

export class ListElement extends React.Component {
  constructor(props) {
    super(props);
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
      showUserInfo = true,
      children,
      elementRef = null,
      showTaxDescription = true,
      showDescription = true
    } = this.props;

    const {editing, originalDescription} = this.state;
    const book = element.book;

    const description = (
      <Description
        editing={editing}
        owner={owner}
        element={element}
        originalDescription={originalDescription}
        showDescription={showDescription}
        onSubmit={this.submit}
        onCancel={this.cancel}
        onChange={this.updateDescription}
      />
    );

    return (
      <div
        ref={elementRef}
        className="listElement p-3 p-md-0 position-relative"
      >
        <div className={'d-flex flex-row'}>
          <div className="position-relative">
            <Link href={'/værk/' + book.pid}>
              <BookCover
                book={book}
                className="width-70 width-md-120 bg-white"
                imageClassName="align-self-start"
              />
            </Link>
            <BookmarkButton
              origin={`Fra ${list.title}`}
              work={element}
              layout="circle"
              style={{position: 'absolute', right: -8, top: -8}}
            />
          </div>

          <div
            style={{flexGrow: '2'}}
            className="d-flex flex-column pl-4 position-relative"
          >
            <div className=" h-100">
              <Title
                Tag="h3"
                type="title5"
                className="m-0"
                data-cy="list-element-work-title"
              >
                {book.title}
              </Title>
              <Text type="body" className="mt-1 mb-3">
                {book.creator}
              </Text>
              <div className="position-relative">
                {showContextMenu && (
                  <ElementContextMenu
                    onDelete={this.deleteElement}
                    onEdit={this.edit}
                    isElementOwner={isElementOwner}
                    isListOwner={isListOwner}
                  />
                )}
                {showTaxDescription && (
                  <Text className="pr-4" type="body" variant="weight-semibold">
                    <TaxDescription text={book.taxonomy_description} />
                  </Text>
                )}
              </div>
              <div className="d-none d-sm-block">{description}</div>
            </div>
            {list.social && (
              <div className="list-divider content-divider d-none d-sm-block" />
            )}
          </div>
        </div>

        <div className="d-block d-sm-none">{description}</div>

        <div className="listElement-userInfo" style={{top: '0', right: '0'}}>
          {!isListOwner && (
            <UserInfo
              showUserInfo={showUserInfo}
              owner={owner}
              time={element._created}
            />
          )}

          {list.social && (
            <div className="list-divider content-divider d-block d-sm-none mt-2" />
          )}
        </div>

        <div>
          {list.social &&
            showComments && (
              <Comments
                className="listElement-comments pt-4"
                id={element._id}
                disabled={this.state.editing}
              />
            )}
          {children}
        </div>

        <div className="list-divider petroleum" />
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
  updateElement: element =>
    dispatch({
      type: UPDATE_LIST_ELEMENT,
      _id: ownProps.list._id,
      element
    }),
  submit: ownProps.submit || (() => dispatch(storeList(ownProps.list._id)))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListElement);
