import React from 'react';
import {connect} from 'react-redux';
import WorkItem from '../../work/WorkItemConnected.component';
import ProfileImage from '../../general/ProfileImage.component';
import Comments from '../../comments/Comment.container';
import AddToList from '../AddToList.container';
import Kryds from '../../svg/Kryds.svg';
import {removeElementFromList, storeList} from '../../../redux/list.reducer';

const SimpleListItem = ({
  book,
  description,
  profile,
  allowComments,
  listId,
  allowDelete,
  // allowModify,
  onRemove
}) => (
  <div className="row simplelist-item mb4">
    <div className="meta col-xs-3 tc">
      <WorkItem
        work={{book}}
        showTaxonomy={false}
        workClass="work simplelist"
      />
    </div>
    <div className="meta col-xs-9">
      <h4 className="w-title h-tight">{book.title}</h4>
      <h5 className="w-creator h-tight mb2">{book.creator}</h5>

      {(description && (
        <div className="profile-description">
          <ProfileImage
            user={profile}
            type="list"
            namePosition={'bottom'}
            className="mb1"
          />
          <p className="t-body">{description}</p>
        </div>
      )) || <p className="t-body">{book.description}</p>}
      {allowComments ? <Comments id={`${listId}-${book.pid}`} /> : ''}
    </div>
    {allowDelete && (
      <img src={Kryds} alt="remove" className="remove-btn" onClick={onRemove} />
    )}
  </div>
);

export const SimpleList = ({list, profile, loggedInUserId, removeElement}) => {
  return (
    <div className="simplelist col-xs-12 col-md-10 col-lg-8 col-xs-offset-0 col-md-offset-1">
      <div className="row mb4">
        <div className="col-xs-3 tc">
          <ProfileImage user={profile} size={'50'} namePosition={'bottom'} />
        </div>
        <div className="col-xs-9">
          <p className="t-body">{list.description}</p>
          {list.social ? <Comments id={list.id} /> : ''}
        </div>
      </div>
      <div className="list">
        {list.list.map(element => (
          <SimpleListItem
            allowComments={list.social}
            listId={list.id}
            key={element.book.pid}
            book={element.book}
            description={element.description}
            profile={profile}
            allowDelete={
              element._owner === loggedInUserId ||
              list._owner === loggedInUserId
            }
            allowModify={element._owner === loggedInUserId}
            onRemove={() => removeElement(element, list)}
          />
        ))}
      </div>
      <AddToList list={list} />
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(SimpleList);
