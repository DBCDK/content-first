import React from 'react';
import {connect} from 'react-redux';
import ProfileImage from '../../general/ProfileImage.component';
import SocialShareButton from '../../general/SocialShareButton.component';
import Comments from '../../comments/Comment.container';
import AddToList from '../AddToList.container';
import {
  UPDATE_LIST_ELEMENT,
  removeElementFromList,
  updateList,
  storeList,
  removeList,
  ADD_LIST_IMAGE
} from '../../../redux/list.reducer';
import timeToString from '../../../utils/timeToString';
import textParser from '../../../utils/textParser';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {FOLLOW, UNFOLLOW} from '../../../redux/follow.reducer';
import Heading from '../../base/Heading';
import Paragraph from '../../base/Paragraph';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import ContextMenu, {ContextMenuAction} from '../../base/ContextMenu';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import ImageUpload from '../../general/ImageUpload.component';
import Textarea from 'react-textarea-autosize';
import ListElement from './ListElement';
import scrollToComponent from 'react-scroll-to-component';

const StickySettings = props => {
  return (
    <div
      className="fixed-top d-flex justify-content-center pointer-events-none"
      style={{top: 140}}
    >
      <div className="fixed-width-col-sm d-xs-none d-xl-block" />
      <div className="list-container fixed-width-col-md" />
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4 pointer-events-initial">
        {props.children}
      </div>
    </div>
  );
};
const StickyEditPanel = ({onSubmit, onCancel, isNew}) => {
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
            onClick={onCancel}
          >
            {isNew ? 'Fortryd oprettelse af liste' : 'Fortryd'}
          </Button>
          <Button
            type="quaternary"
            className="mr-4 ml-2 mt-2 mb-2 mt-sm-4 mb-sm-4"
            onClick={onSubmit}
          >
            {isNew ? 'Gem liste' : 'Gem ændringer'}
          </Button>
        </div>
      </div>
      <div className="fixed-width-col-sm d-xs-none d-lg-block ml-4" />
    </div>
  );
};

const ListContextMenu = ({
  onEdit,
  onDelete,
  onEditSettings,
  title,
  className,
  style
}) => (
  <ContextMenu title={title} className={className} style={style}>
    <ContextMenuAction
      title="Redigér tekst og billede"
      icon="edit"
      onClick={onEdit}
    />
    <ContextMenuAction title="Skift rækkefølge" icon="swap_vert" />
    <ContextMenuAction
      title="Redigér indstillinger"
      icon="settings"
      onClick={onEditSettings}
    />
    <ContextMenuAction title="Slet liste" icon="clear" onClick={onDelete} />
  </ContextMenu>
);
const ListTop = ({
  list,
  profile,
  editing,
  onDescriptionChange,
  onTitleChange,
  contextMenu,
  addImage,
  confirmShareModal,
  isFollowing,
  toggleFollow,
  scrollToAdd
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
        <div
          className="d-flex flex-row position-absolute pr-4"
          style={{right: 0, top: 0}}
        >
          <SocialShareButton
            className={list.type === 'SYSTEM_LIST' ? 'd-none' : 'ssb-fb'}
            facebook={true}
            href={
              list.public
                ? 'https://content-first.demo.dbc.dk/lister/' + list._id
                : null
            }
            hex={'#3b5998'}
            size={30}
            txt="Del"
            shape="round"
            status={!list.public || editing ? 'passive' : 'active'}
            hoverTitle="Del på facebook"
            onClick={() => {
              confirmShareModal(list._id);
            }}
          />
          {contextMenu}
        </div>

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
          <React.Fragment>
            <Textarea
              className={`mt-3 form-control Heading Heading__section`}
              name="list-description"
              placeholder="Listens titel"
              onChange={onTitleChange}
              value={list.title}
            />
            {!(list.title && list.title.trim()) && (
              <Paragraph className="mt-2" style={{color: 'red'}}>
                Listen skal have en titel
              </Paragraph>
            )}
          </React.Fragment>
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
              placeholder="Fortæl om listen"
              onChange={onDescriptionChange}
              value={list.description}
            />
          </React.Fragment>
        ) : (
          <Paragraph>
            {' '}
            <span
              dangerouslySetInnerHTML={{
                __html: textParser(list.description || '')
              }}
            />
          </Paragraph>
        )}
      </div>
      <div className="d-flex flex-row lys-graa justify-content-between d-lg-none pb-3">
        <Button
          type="link2"
          className="ml-4"
          style={{color: isFollowing ? 'var(--de-york)' : 'var(--petrolium)'}}
          onClick={() => {
            toggleFollow(list._id);
          }}
        >
          <Icon name="visibility" className="align-middle" />
          <span className="align-middle ml-2">Følg liste</span>
        </Button>
        <Button type="link2" className="mr-4" onClick={scrollToAdd}>
          <Icon name="add" className="align-middle" />
          <span className="align-middle ml-2">Tilføj en bog</span>
        </Button>
      </div>
      {list.social && (
        <Comments
          className="m-0 pl-4 pr-4 pt-4 pb-0 porcelain"
          id={list._id}
          disabled={editing}
        />
      )}
    </div>
  );
};

export class SimpleList extends React.Component {
  constructor(props) {
    super();
    this.state = this.getInitialState(props);
  }
  getInitialState(props) {
    return {
      editing: props.list.title ? false : true,
      originalDescription: props.list.description,
      originalTitle: props.list.title,
      originalImage: props.list.image,
      isNew: !props.list.title
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.list._id !== this.props.list._id) {
      this.setState(this.getInitialState(this.props));
    }
  }
  toggleFollow = _id => {
    if (this.props.isLoggedIn) {
      if (this.props.isFollowing) {
        this.props.unfollow(_id);
      } else {
        this.props.follow(_id, 'list');
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
  };
  onEdit = () => {
    this.setState({editing: true});
    scrollToComponent(this.refs.cover, {
      align: 'top',
      offset: -100,
      duration: 500
    });
  };

  scrollToAdd = () => {
    scrollToComponent(this.refs.suggester, {
      align: 'top',
      offset: -100,
      duration: 500
    });
    this.refs.suggester.input.focus();
  };

  render() {
    const {
      list,
      updateListData,
      submit,
      addImage,
      isOwner,
      confirmDeleteModal,
      isFollowing,
      exitList,
      openListSettingsModal
    } = this.props;
    const {added, isNew} = this.state;
    return (
      <React.Fragment>
        {this.state.editing && (
          <StickyEditPanel
            isNew={isNew}
            onSubmit={() => {
              if (!list.title.trim()) {
                return;
              }
              submit(list);
              this.setState({
                isNew: false,
                editing: false,
                originalTitle: list.title,
                originalDescription: list.description,
                originalImage: list.image
              });
            }}
            cancelText={this.state.originalTitle}
            onCancel={() => {
              if (isNew) {
                // cancel creation of new list, redirect
                return exitList();
              }
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
          <Button
            type="link2"
            style={{color: isFollowing ? 'var(--de-york)' : 'var(--petrolium)'}}
            onClick={() => {
              this.toggleFollow(list._id);
            }}
          >
            <Icon name="visibility" className="align-middle" />
            <span className="align-middle ml-2">Følg liste</span>
          </Button>
          <Button type="link2" className="mt-3" onClick={this.scrollToAdd}>
            <Icon name="add" className="align-middle" />
            <span className="align-middle ml-2">Tilføj en bog til listen</span>
          </Button>
          {isOwner && (
            <ListContextMenu
              className="mt-3"
              onEdit={this.onEdit}
              onDelete={() => {
                confirmDeleteModal(list._id);
              }}
              onEditSettings={() => openListSettingsModal({_id: list._id})}
              title="Redigér liste"
            />
          )}
        </StickySettings>
        <div className="d-flex justify-content-center mt-5 mb-5">
          <div className="fixed-width-col-sm d-xs-none d-xl-block" />
          <div
            className="list-container pistache fixed-width-col-md"
            ref={cover => {
              this.refs = {...this.refs, cover};
            }}
          >
            <ListTop
              {...this.props}
              scrollToAdd={this.scrollToAdd}
              toggleFollow={this.toggleFollow}
              editing={this.state.editing}
              onDescriptionChange={e => {
                updateListData({_id: list._id, description: e.target.value});
              }}
              onTitleChange={e => {
                updateListData({_id: list._id, title: e.target.value});
              }}
              contextMenu={
                isOwner && (
                  <ListContextMenu
                    className="ml-3 d-lg-none"
                    style={{right: 0, top: 0}}
                    title=""
                    onEdit={this.onEdit}
                    onEditSettings={() =>
                      openListSettingsModal({_id: list._id})
                    }
                  />
                )
              }
              addImage={addImage}
            />
            <div className="position-relative">
              {list.list.map(element => {
                return (
                  <ListElement
                    key={element.pid}
                    element={element}
                    list={list}
                    editing={added === element.pid ? true : false}
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
            <AddToList
              suggesterRef={suggester => {
                this.refs = {...this.refs, suggester};
              }}
              className="pt-5"
              style={{minHeight: 500, background: 'white'}}
              list={list}
              onAdd={pid => this.setState({added: pid})}
            />
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
    isFollowing: state.followReducer[ownProps.list._id],
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
  confirmDeleteModal: _id => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: 'Skal denne liste slettes?',
        reason: 'Er du sikker på du vil slette den valgte liste.',
        confirmText: 'Slet liste',
        onConfirm: () => {
          dispatch(
            removeList(_id),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          );
          dispatch({type: HISTORY_REPLACE, path: '/profile'});
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
  openModal: (context, modal) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context
    });
  },
  openListSettingsModal: context => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'listSettings',
      context
    });
  },
  exitList: () => dispatch({type: HISTORY_REPLACE, path: '/profile'})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleList);
