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

export class SimpleListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editing: false,
      listPublic: this.props.list.public,
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
    if (!profile || !element) {
      return null;
    }
    return (
      <div className="row simplelist-item mb4">
        <div className="meta col-xs-3 tc">
          <WorkItem
            work={element}
            showTaxonomy={false}
            workClass="work simplelist"
          />
        </div>
        <div className="meta col-xs-9">
          <h4 className="w-title h-tight">{element.book.title}</h4>
          <h5 className="w-creator h-tight mb2">{element.book.creator}</h5>
          <div className="profile-description mb2">
            {allowModify ? (
              <button
                className="comment-edit-button btn btn-link link-subtle mr2"
                onClick={() => this.setState({editing: !this.state.editing})}
              >
                <span className="glyphicon glyphicon-pencil" />
              </button>
            ) : null}
            <div className="flex" style={{width: '100%'}}>
              <ProfileImage
                user={profile}
                style={{flexShrink: 0}}
                style={{marginRight: '20px'}}
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
                    element.description || element.book.description
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

export const SimpleList = ({
  list,
  profile,
  loggedInUserId,
  removeElement,
  updateElement,
  submit,
  profiles,
  confirmShareModal
}) => {
  return (
    <div className="simplelist">
      <SocialShareButton
        className="ssb-fb"
        href={
          list.public
            ? 'https://content-first.demo.dbc.dk/lister/' + list.id
            : null
        }
        icon={'fb-icon'}
        hex={'#3b5998'}
        status={!list.public ? 'passive' : 'active'}
        size={30}
        shape="square"
        txt="Del"
        hoverTitle="Del på facebook"
        onClick={() => {
          confirmShareModal(list.id);
        }}
      />
      <div className="row mb4 b-dark">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xs-offset-0 col-md-offset-1">
          <div className="col-xs-3 tc">
            <ProfileImage user={profile} size={'50'} namePosition={'bottom'} />
          </div>
          <div className="col-xs-9 mb4">
            <p className="t-body">{list.description}</p>
            {list.social ? <Comments id={list.id} /> : ''}
          </div>
        </div>
      </div>
      <div className="list col-xs-12 col-md-10 col-lg-8 col-xs-offset-0 col-md-offset-1">
        <div>
          {list.list.map(element => (
            <SimpleListItem
              allowComments={list.social}
              list={list}
              key={element.book.pid}
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
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    loggedInUserId: state.userReducer.openplatformId,
    isOwner:
      ownProps.list && ownProps.list._owner === state.userReducer.openplatformId
  };
};
export const mapDispatchToProps = dispatch => ({
  removeElement: async (element, list) => {
    await dispatch(removeElementFromList(element, list.id));
    dispatch(storeList(list.id));
  },
  updateElement: (element, list) => {
    dispatch({type: UPDATE_LIST_ELEMENT, id: list.id, element});
  },
  submit: list => dispatch(storeList(list.id)),
  confirmShareModal: id => {
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
              id: id,
              public: true
            }),
            dispatch({
              type: 'CLOSE_MODAL',
              modal: 'confirm'
            })
          );
          dispatch(storeList(id));
        },
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(SimpleList);
