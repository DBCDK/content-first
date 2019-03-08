import React from 'react';
import {connect} from 'react-redux';
import {
  updateList,
  storeList,
  ADD_LIST_IMAGE,
  getListByIdSelector
} from '../../../../redux/list.reducer';
import {getUser} from '../../../../redux/users';
import ProfileImage from '../../../general/ProfileImage.component';
import SocialShareButton from '../../../general/SocialShareButton.component';
import CommentCounter from '../../../comments/CommentCounter.component';
import T from '../../../base/T';
import Text from '../../../base/Text';
import FollowButton from '../../button/FollowButton';

const getListById = getListByIdSelector();

export const ListInfo = ({
  list,
  profile,
  editing,
  onDescriptionChange,
  onTitleChange,
  addImage,
  confirmShareModal,
  onAddBook,
  onEdit,
  titleMissing
}) => {
  return (
    <div className="lys-graa position-relative">
      <div>
        <img className="w-100" src={`/v1/image/${list.image}/719/400`} />
      </div>

      <div className="list-info pl-3 pr-3">
        <div className="list-owner d-flex justify-content-between ">
          <ProfileImage user={profile} size={'40'} namePosition="right" />
          <SocialShareButton
            className={'ssb-fb align-middle'}
            facebook={true}
            href={'https://laesekompas.dk/lister/' + list._id}
            hex={'#3b5998'}
            size={40}
            shape="round"
            hoverTitle={<T component="share" name="shareOnFacebook" />}
            onClick={e => {
              if (!list.public) {
                e.preventDefault();
                confirmShareModal(list._id);
                return false;
              }
            }}
          />
        </div>

        {list.description.length > 0 ? (
          <div className="list-pr pt-3 pb-4">
            <Text type="body">{list.description}</Text>
          </div>
        ) : (
          <div className="pb-4" />
        )}

        <div className="list-divider m-0" />

        <div className="list-interactions d-flex flex-row-reverse justify-content-between">
          <FollowButton _id={list._id} />
          <CommentCounter id={list._id} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    list,
    profile: getUser(state, {id: list._owner})
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  confirmShareModal: _id => {
    dispatch({
      type: 'OPEN_MODAL',
      modal: 'confirm',
      context: {
        title: <T component="share" name="shareModalTitle" />,
        reason: <T component="share" name="shareModalDescription" />,
        confirmText: <T component="share" name="makePublicButton" />,
        url:
          'https://www.facebook.com/sharer/sharer.php?display=page&u=https://laesekompas.dk/lister/' +
          _id,
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
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListInfo);
