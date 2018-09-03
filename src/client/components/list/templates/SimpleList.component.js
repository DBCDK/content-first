import React from 'react';
import {connect} from 'react-redux';
import WorkItem from '../../work/WorkItemConnected.component';
import ProfileImage from '../../general/ProfileImage.component';
import SocialShareButton from '../../general/SocialShareButton.component';
import Comments from '../../comments/Comment.container';
import AddToList from '../AddToList.container';
import Kryds from '../../svg/Kryds.svg';
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

export class Item extends React.Component {
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
      profile,
      allowComments,
      list,
      allowDelete,
      allowModify,
      onRemove,
      onDescriptionChange,
      onSubmit
    } = this.props;
    if (!profile || !element || !element.book) {
      return null;
    }

    return (
      <div className="row simplelist-item mb4">
        <div className="meta col-3 tc">
          <WorkItem
            work={element}
            showTaxonomy={false}
            workClass="work simplelist"
          />
        </div>
        <div className="meta col-9">
          <h4 className="w-title h-tight">{element.book.title}</h4>
          <h5 className="w-creator h-tight mb2">{element.book.creator}</h5>
          <div className="profile-description mb2">
            {allowModify ? (
              <button
                className="comment-edit-button btn btn-link link-subtle mr2"
                onClick={() => this.setState({editing: !this.state.editing})}
              >
                <i className="material-icons" style={{fontSize: '18px'}}>
                  edit
                </i>
              </button>
            ) : null}
            <div className="flex" style={{width: '100%'}}>
              <ProfileImage
                user={profile}
                style={{marginRight: '20px', flexShrink: 0}}
              />
              <div style={{flexGrow: 1}}>
                <div className="comment-author">{profile.name || ''}</div>
                <div className="comment-time mb1">
                  {timeToString(element._created)}
                </div>
              </div>
            </div>
            {this.state.editing ? (
              <CommentInput
                hideProfile={true}
                autoFocus={true}
                user={profile}
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
              <p
                className="t-body"
                dangerouslySetInnerHTML={{
                  __html: textParser(
                    element.description || element.book.description || ''
                  )
                }}
              />
            )}
          </div>
          {allowComments ? (
            <Comments id={`${list._id}-${element.book.pid}`} />
          ) : (
            ''
          )}
        </div>
        {allowDelete && (
          <img
            style={{right: 30, top: 5, color: 'gray'}}
            src={Kryds}
            alt="remove"
            className="remove-btn"
            onClick={onRemove}
          />
        )}
      </div>
    );
  }
}

export class SimpleList extends React.Component {
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
      loggedInUserId,
      removeElement,
      updateElement,
      submit,
      profiles,
      confirmShareModal,
      editButton
    } = this.props;

    return (
      <div className="list-wrapper tl">
        <div className="row b-dark">
          <div className="list-media-icons">
            <SocialShareButton
              className={this.props.isOwner ? 'd-none' : 'ssb-follow'}
              href={null}
              icon={'remove_red_eye'}
              hex={'#6dc1ec'}
              size={30}
              logoSize={12}
              shape="square"
              txt="Følg"
              hoverTitle={'Følg ' + list.title}
              status={
                this.props.follows[this.props.list._id] ? 'active' : 'passive'
              }
              onClick={() => this.toggleFollow(list._id, 'list')}
            />

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
              shape="square"
              status={!list.public ? 'passive' : 'active'}
              hoverTitle="Del på facebook"
              onClick={() => {
                confirmShareModal(list._id);
              }}
            />
          </div>
          <div className="list-header mb4 mt5   offset-lg-1 offset-sm-0 ">
            <h1 className="t-title h-tight h-underline inline-block align-middle">
              {list.title}
            </h1>
            {editButton}
          </div>
        </div>
        <div className="simplelist">
          <div className="row mb4 b-dark">
            <div className="col-12 col-md-10 col-lg-8   offset-lg-1 offset-sm-0  mb4 row">
              <div className="col-3 tc">
                <ProfileImage
                  user={profile}
                  size={'50'}
                  namePosition={'bottom'}
                />
              </div>
              <div className="col-9">
                <p className="t-body">{list.description}</p>
                {list.social ? <Comments id={list._id} /> : ''}
              </div>
            </div>
          </div>
          <div className="list col-12 col-md-10 col-lg-8  offset-lg-1 offset-sm-0 ">
            <div>
              {list.list.map(element => (
                <Item
                  allowComments={list.social}
                  list={list}
                  key={element.pid}
                  element={element}
                  book={element.book}
                  description={element.description}
                  profile={profiles[element._owner]}
                  allowDelete={
                    element._owner === loggedInUserId ||
                    list._owner === loggedInUserId
                  }
                  allowModify={element._owner === loggedInUserId}
                  _created={list._created}
                  onRemove={() => removeElement(element, list)}
                  onDescriptionChange={description =>
                    updateElement({...element, description}, list)
                  }
                  onSubmit={() => submit(list)}
                />
              ))}
            </div>
            <AddToList list={list} />
          </div>
        </div>
      </div>
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
  removeElement: async (element, list) => {
    await dispatch(removeElementFromList(element, list._id));
    dispatch(storeList(list._id));
  },
  updateElement: (element, list) => {
    dispatch({type: UPDATE_LIST_ELEMENT, _id: list._id, element});
  },
  submit: list => dispatch(storeList(list._id)),
  follow: (_id, cat) =>
    dispatch({
      type: FOLLOW,
      _id,
      cat
    }),
  unfollow: _id => {
    dispatch({
      type: UNFOLLOW,
      _id
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
