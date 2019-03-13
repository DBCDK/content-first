import React from 'react';
import {connect} from 'react-redux';

import Title from '../base/Title';
import Text from '../base/Text';
import T from '../base/T';
import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';
import BookCover from '../general/BookCover.component';

import textParser from '../../utils/textParser';

import Link from '../general/Link.component';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import TaxDescription from './TaxDescription.component.js';

import CommentInput from '../comments/CommentInput.component';

import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  storeList
} from '../../redux/list.reducer';

const Details = ({book, showDetails}) => {
  if (!showDetails) {
    return null;
  }
  return (
    <div className="d-flex">
      <Text type="micro" className="mr-3">
        Sideantal: {book.pages}
      </Text>
      <Text type="micro" className="mr-3">
        Sprog: {book.language}
      </Text>
      <Text type="micro" className="mr-3">
        Udgivet: {book.first_edition_year}
      </Text>
    </div>
  );
};

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
            name: 'editPost'
          })}
          icon="edit"
          onClick={onEdit}
        />
      )}
      {(isElementOwner || isListOwner) && (
        <ContextMenuAction
          title={T({
            component: 'post',
            name: 'deletePost'
          })}
          icon="clear"
          onClick={onDelete}
        />
      )}
    </ContextMenu>
  );
};

export class WorkRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: props.editing || false,
      originalDescription: props.work.description
    };
  }

  submit = () => {
    const {submit, work} = this.props;
    this.setState({
      editing: false,
      originalDescription: work.description
    });
    submit();
  };

  cancel = () => {
    const {work, updateElement} = this.props;
    this.setState({editing: false});
    updateElement({...work, description: this.state.originalDescription});
  };

  updateDescription = description => {
    const {work, updateElement} = this.props;
    updateElement({...work, description});
  };

  deleteElement = () => {
    const {removeElement} = this.props;
    removeElement();
  };

  edit = () => this.setState({editing: true});

  render() {
    const {
      work,
      owner,
      className,
      origin,
      isElementOwner,
      isListOwner,
      showTaxDescription = false,
      showAddToListButton = false,
      showContextMenu = false,
      showDescription = false,
      showDetails = false
    } = this.props;

    const {editing, originalDescription} = this.state;

    const book = work.book;

    return (
      <div className={'d-flex flex-row ' + className}>
        <div className="position-relative">
          <Link href={'/værk/' + book.pid}>
            <BookCover
              book={book}
              className="width-70 width-md-120"
              imageClassName="align-self-start"
            />
          </Link>
          <BookmarkButton
            origin={origin}
            work={work}
            layout="circle"
            style={{position: 'absolute', right: -8, top: -8}}
          />
        </div>

        <div style={{flexGrow: '2'}} className="pl-4">
          <div className="position-relative">
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
            {showTaxDescription && (
              <Text type="body" variant="weight-semibold">
                <TaxDescription text={book.taxonomy_description} />
              </Text>
            )}
          </div>

          <div>
            {showDescription && editing ? (
              <CommentInput
                className="mt-3 ml-3"
                hideProfile={true}
                autoFocus={true}
                user={owner}
                value={work.description}
                cancelText={
                  <T
                    component="general"
                    name={originalDescription ? 'cancel' : 'useBookDescription'}
                  />
                }
                onSubmit={this.submit}
                onCancel={this.cancel}
                onChange={this.updateDescription}
                disabled={false}
                error={null}
                placeholder={T({
                  component: 'post',
                  name: 'aboutTheBook'
                })}
              />
            ) : (
              showDescription && (
                <Text type="body" className="mt-3">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: textParser(
                        work.description || work.book.description || ''
                      )
                    }}
                  />
                </Text>
              )
            )}
            <div className="list-divider list-mr mt-4 mb-4" />
          </div>

          <Details book={book} showDetails={showDetails} />
          {showAddToListButton && <AddToListButton work={work} />}
        </div>
        <div className="list-pr position">
          {showContextMenu && (
            <ElementContextMenu
              onDelete={this.deleteElement}
              onEdit={this.edit}
              isElementOwner={isElementOwner}
              isListOwner={isListOwner}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeElement: async () => {
    await dispatch(removeElementFromList(ownProps.work, ownProps.list._id));
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
)(WorkRow);
