import React from 'react';
import {connect} from 'react-redux';
import WorkItem from '../../work/WorkItemConnected.component';
import ProfileImage from '../../general/ProfileImage.component';
import SocialShareButton from '../../general/SocialShareButton.component';
import Comments from '../../comments/Comment.container';
import AddToList from '../AddToList.container';
import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  updateList,
  storeList,
  ADD_LIST_IMAGE
} from '../../../redux/list.reducer';
import CommentInput from '../../comments/CommentInput.component';
import timeToString from '../../../utils/timeToString';
import textParser from '../../../utils/textParser';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {FOLLOW, UNFOLLOW} from '../../../redux/follow.reducer';
import Heading from '../../base/Heading';
import Paragraph from '../../base/Paragraph';
import Button from '../../base/Button';
import BookCover from '../../general/BookCover.component';
import Icon from '../../base/Icon';
import Link from '../../general/Link.component';
import BookmarkButton from '../../general/BookmarkButton';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import ImageUpload from '../../general/ImageUpload.component';
import Textarea from 'react-textarea-autosize';

const StickySettings = props => {
  return (
    <div className="fixed-top d-flex justify-content-center" style={{top: 140}}>
      <div className="fixed-width-col-sm d-xs-none d-xl-block" />
      <div className="list-container fixed-width-col-md" />
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4">
        {props.children}
      </div>
    </div>
  );
};
const StickyEditBar = ({onSubmit, onCancel}) => {
  return (
    <div className="fixed-bottom d-flex justify-content-center lys-graa">
      <div className="fixed-width-col-sm d-xs-none d-xl-block" />
      <div className="list-container fixed-width-col-md m4">
        <div className="EditBar d-flex flex-column flex-sm-row justify-content-end">
          <Button
            type="link"
            size="medium"
            className="mr-2 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
            onClick={onCancel}
          >
            Fortryd ændringer
          </Button>
          <Button
            type="quinary"
            className="mr-2 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
          >
            Slet liste
          </Button>
          <Button
            type="quaternary"
            className="mr-2 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
            onClick={onSubmit}
          >
            Gem ændringer
          </Button>
        </div>
      </div>
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4" />
    </div>
  );
};
const ElementContextMenu = ({onDelete, onEdit}) => (
  <ContextMenu
    className="mr-1 mt-2 position-absolute"
    style={{right: 0, top: 0}}
  >
    <ContextMenuAction title="Redigér indlæg" icon="edit" onClick={onEdit} />
    <ContextMenuAction title="Slet indlæg" icon="clear" onClick={onDelete} />
  </ContextMenu>
);
const ListContextMenu = ({onEdit, title, className, style}) => (
  <ContextMenu title={title} className={className} style={style}>
    <ContextMenuAction
      title="Redigér tekst og billede"
      icon="edit"
      onClick={onEdit}
    />
    <ContextMenuAction title="Skift rækkefølge" icon="swap_vert" />
    <ContextMenuAction title="Redigér indstillinger" icon="settings" />
  </ContextMenu>
);

const ListTop = ({
  list,
  profile,
  editing,
  onDescriptionChange,
  onTitleChange,
  contextMenu,
  addImage
}) => {
  return (
    <div className="box-shadow">
      <div className="list-cover-image-wrapper p-4 lys-graa">
        {editing ? (
          <ImageUpload
            error={list.imageError}
            style={{borderRadius: 0, border: 0, width: '100%', height: '100%'}}
            loading={list.imageIsLoading}
            handleLoaded={this.onResize}
            previewImage={list.image ? `/v1/image/${list.image}/719/400` : null}
            buttonText="Skift billede"
            buttonPosition="inside"
            onFile={img => {
              addImage(list._id, img);
            }}
          />
        ) : (
          <img
            className="list-cover-image w-100"
            alt=""
            src={`/v1/image/${list.image}/719/400`}
          />
        )}
      </div>
      <div className="pl-4 pr-4 pb-4 lys-graa pt-2 position-relative">
        {contextMenu}
        <div className="d-flex flex-row">
          <ProfileImage user={profile} size={'40'} namePosition="right" />
          <Heading
            tag="h5"
            type="title"
            className="ml-4 due-txt"
            style={{fontWeight: 400}}
          >
            {timeToString(list._created)}
          </Heading>
        </div>
        {editing ? (
          <Textarea
            className={`mt-3 form-control Heading Heading__section`}
            name="list-description"
            placeholder="Din beskrivelse"
            onChange={onTitleChange}
            value={list.title}
          />
        ) : (
          <Heading Tag="h1" type="section" className="mt-3">
            {list.title}
          </Heading>
        )}

        {editing ? (
          <React.Fragment>
            <Textarea
              className={`form-control mt-4 comment-textarea`}
              name="list-description"
              placeholder="Din beskrivelse"
              onChange={onDescriptionChange}
              value={list.description}
            />
          </React.Fragment>
        ) : (
          <Paragraph>{list.description}</Paragraph>
        )}
      </div>
      {list.social && (
        <div className="pl-4 pr-4 pt-4 pb-0 porcelain">
          <Comments id={list._id} />
        </div>
      )}
    </div>
  );
};
export class ListElement extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editing: false,
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
      onDescriptionChange,
      onSubmit
    } = this.props;
    return (
      <div className="mt-2 mt-md-4 lys-graa box-shadow position-relative">
        {isOwner && (
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
          {this.state.editing ? (
            <CommentInput
              hideProfile={true}
              autoFocus={true}
              user={owner}
              value={element.description}
              onSubmit={() => {
                this.setState({
                  editing: false,
                  originalDescription: element.description
                });
                onSubmit();
              }}
              onCancel={() => {
                this.setState({editing: false});
                onDescriptionChange(this.state.originalDescription);
              }}
              onChange={onDescriptionChange}
              disabled={false}
              error={null}
            />
          ) : (
            <Paragraph className="mt-3">{element.description}</Paragraph>
          )}
          <WorkRow
            work={element}
            origin={`Fra "${list.title}"`}
            className="mt-4"
          />
        </div>
        {list.social && (
          <div className="pl-4 pr-4 pt-4 pb-0 porcelain">
            <Comments id={element._id} />
          </div>
        )}
      </div>
    );
  }
}
const WorkRow = ({work, className, origin}) => {
  const book = work.book;
  return (
    <div className={'d-flex flex-row ' + className}>
      <div style={{position: 'relative'}}>
        <Link href={'/værk/' + book.pid}>
          <BookCover book={book} className="width-70 width-md-120" />
        </Link>
        <BookmarkButton
          origin={origin}
          work={work}
          layout="circle"
          style={{position: 'absolute', right: -8, top: -8}}
        />
      </div>

      <div className="ml-3">
        <Heading tag="h3" type="title">
          {book.title}
        </Heading>
        <Heading tag="h3" type="subtitle">
          {book.creator}
        </Heading>
        {book.taxonomy_description &&
          book.taxonomy_description.split('\n').map(line => (
            <div key={line} style={{fontWeight: 600}}>
              {line}.
            </div>
          ))}
      </div>
    </div>
  );
};

export class SimpleList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editing: false,
      originalDescription: props.list.description,
      originalTitle: props.list.title,
      originalImage: props.list.image
    };
  }
  toggleFollow(_id, cat) {
    if (this.props.isLoggedIn) {
      if (this.props.follows[_id]) {
        this.props.unfollow(_id);
      } else {
        this.props.follow(_id, cat);
      }
    } else {
      this.props.openModal(
        {
          title: 'Følg liste',
          reason: 'Du skal logge ind for at følge en liste.'
        },
        'login'
      );
    }
  }

  render() {
    const {
      list,
      profile,
      profiles,
      loggedInUserId,
      removeElement,
      updateElement,
      updateListData,
      submit,
      addImage
    } = this.props;

    return (
      <React.Fragment>
        {this.state.editing && (
          <StickyEditBar
            onSubmit={() => {
              submit(list);
              this.setState({
                editing: false,
                originalTitle: list.title,
                originalDescription: list.description,
                originalImage: list.image
              });
            }}
            onCancel={() => {
              this.setState({editing: false});
              updateListData({
                _id: list._id,
                title: this.state.originalTitle,
                description: this.state.originalDescription,
                image: this.state.originalImage
              });
            }}
          />
        )}
        <StickySettings>
          <div>
            <Icon
              name="visibility"
              className="align-middle"
              onClick={() => {}}
            />
            <span className="align-middle ml-2">Følg liste</span>
          </div>
          <div className="mt-3">
            <Icon name="add" className="align-middle" onClick={() => {}} />
            <span className="align-middle ml-2">Tilføj en bog til listen</span>
          </div>
          <ListContextMenu
            className="mt-3"
            onEdit={() => this.setState({editing: true})}
            title="Redigér liste"
          />
        </StickySettings>
        <div className="d-flex justify-content-center mt-5 mb-5">
          <div className="fixed-width-col-sm d-xs-none d-xl-block" />
          <div className="list-container pistache fixed-width-col-md">
            <ListTop
              {...this.props}
              editing={this.state.editing}
              onDescriptionChange={e => {
                updateListData({_id: list._id, description: e.target.value});
              }}
              onTitleChange={e => {
                updateListData({_id: list._id, title: e.target.value});
              }}
              contextMenu={
                <ListContextMenu
                  className="position-absolute mr-2 d-lg-none"
                  style={{right: 0, top: 0}}
                  title=""
                  onEdit={() => this.setState({editing: true})}
                />
              }
              addImage={addImage}
            />
            <div className="position-relative">
              {list.list.map(element => {
                const isElementOwner = loggedInUserId === element._owner;
                return (
                  <ListElement
                    key={element.pid}
                    element={element}
                    owner={profiles[element._owner]}
                    isOwner={isElementOwner}
                    list={list}
                    removeElement={removeElement}
                    onDescriptionChange={description =>
                      updateElement({...element, description}, list)
                    }
                    onSubmit={() => submit(list)}
                  />
                );
              })}
              {this.state.editing && (
                <div
                  className="position-absolute"
                  style={{
                    width: '100%',
                    height: '100%',
                    top: 0,
                    background: 'white',
                    opacity: 0.7,
                    zIndex: 1000
                  }}
                />
              )}
            </div>
          </div>
          <div className="fixed-width-col-sm d-xs-none d-lg-block mt-4 ml-4" />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedInUserId: state.userReducer.openplatformId,
    follows: state.followReducer,
    isOwner:
      ownProps.list &&
      ownProps.list._owner === state.userReducer.openplatformId,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  addImage: (_id, image) => dispatch({type: ADD_LIST_IMAGE, image, _id}),
  removeElement: async (element, list) => {
    await dispatch(removeElementFromList(element, list._id));
    dispatch(storeList(list._id));
  },
  updateListData: data => dispatch(updateList(data)),
  updateElement: (element, list) => {
    dispatch({type: UPDATE_LIST_ELEMENT, _id: list._id, element});
  },
  submit: list => dispatch(storeList(list._id)),
  follow: (id, cat) =>
    dispatch({
      type: FOLLOW,
      id,
      cat
    }),
  unfollow: id => {
    dispatch({
      type: UNFOLLOW,
      id
    });
  },
  confirmShareModal: _id => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: 'Din liste skal være offentlig!',
        reason:
          'For at du kan dele din liste, skal listen være offentlig. Vil du ændre din listes status til offentlig?',
        confirmText: 'Gør min liste offentlig',
        onConfirm: () => {
          dispatch(
            updateList({
              _id,
              public: true
            }),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          );
          dispatch(storeList(_id));
        },
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  },
  openModal: (work, modal) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context: work
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleList);
