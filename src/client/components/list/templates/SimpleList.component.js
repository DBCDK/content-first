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
  storeList
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
      title="Redigér titel og beskrivelse"
      icon="edit"
      onClick={onEdit}
    />
    <ContextMenuAction title="Skift billede" icon="photo" onClick={onEdit} />
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
  contextMenu
}) => {
  return (
    <div className="box-shadow">
      <div className="list-cover-image-wrapper p-4 lys-graa">
        <img
          className="list-cover-image w-100"
          alt=""
          src={`/v1/image/${list.image}/719/400`}
        />
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
          <React.Fragment>
            <Textarea
              className={`mt-3 form-control Heading Heading__section`}
              name="list-description"
              placeholder="Din beskrivelse"
              onChange={onTitleChange}
              value={list.title}
            />
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
      originalTitle: props.list.title
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
      submit
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
                originalDescription: list.description
              });
            }}
            onCancel={() => {
              this.setState({editing: false});
              updateListData({
                _id: list._id,
                title: this.state.originalTitle
              });
              updateListData({
                _id: list._id,
                description: this.state.originalDescription
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
    // return (
    //   <div className="list-wrapper tl">
    //     <div className="row b-dark">
    //       <div className="list-media-icons">
    //         <SocialShareButton
    //           className={this.props.isOwner ? 'd-none' : 'ssb-follow'}
    //           href={null}
    //           icon={'remove_red_eye'}
    //           hex={'#6dc1ec'}
    //           size={30}
    //           logoSize={12}
    //           shape="square"
    //           txt="Følg"
    //           hoverTitle={'Følg ' + list.title}
    //           status={
    //             this.props.follows[this.props.list._id] ? 'active' : 'passive'
    //           }
    //           onClick={() => this.toggleFollow(list._id, 'list')}
    //         />
    //
    //         <SocialShareButton
    //           className={list.type === 'SYSTEM_LIST' ? 'd-none' : 'ssb-fb'}
    //           facebook={true}
    //           href={
    //             list.public
    //               ? 'https://content-first.demo.dbc.dk/lister/' + list._id
    //               : null
    //           }
    //           hex={'#3b5998'}
    //           size={30}
    //           txt="Del"
    //           shape="square"
    //           status={!list.public ? 'passive' : 'active'}
    //           hoverTitle="Del på facebook"
    //           onClick={() => {
    //             confirmShareModal(list._id);
    //           }}
    //         />
    //       </div>
    //       <div className="list-header mb4 mt5   offset-lg-1 offset-sm-0 ">
    //         <h1 className="t-title h-tight h-underline inline-block align-middle">
    //           {list.title}
    //         </h1>
    //         {editButton}
    //       </div>
    //     </div>
    //     <div className="simplelist">
    //       <div className="row mb4 b-dark">
    //         <div className="col-12 col-md-10 col-lg-8   offset-lg-1 offset-sm-0  mb4 row">
    //           <div className="col-3 tc">
    //             <ProfileImage
    //               user={profile}
    //               size={'50'}
    //               namePosition={'bottom'}
    //             />
    //           </div>
    //           <div className="col-9">
    //             <p className="t-body">{list.description}</p>
    //             {list.social ? <Comments id={list._id} /> : ''}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="list col-12 col-md-10 col-lg-8  offset-lg-1 offset-sm-0 ">
    //         <div>
    //           {list.list.map(element => (
    //             <Item
    //               allowComments={list.social}
    //               list={list}
    //               key={element.pid}
    //               element={element}
    //               book={element.book}
    //               description={element.description}
    //               profile={profiles[element._owner]}
    //               allowDelete={
    //                 element._owner === loggedInUserId ||
    //                 list._owner === loggedInUserId
    //               }
    //               allowModify={element._owner === loggedInUserId}
    //               _created={list._created}
    //               onRemove={() => removeElement(element, list)}
    //               onDescriptionChange={description =>
    //                 updateElement({...element, description}, list)
    //               }
    //               onSubmit={() => submit(list)}
    //             />
    //           ))}
    //         </div>
    //         <AddToList list={list} />
    //       </div>
    //     </div>
    //   </div>
    // );
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
