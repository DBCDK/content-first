import React from 'react';
import {connect} from 'react-redux';
import {updateList, storeList} from '../../../../redux/list.reducer';
import ProfileImage from '../../../general/ProfileImage.component';
import CommentCounter from '../../../comments/CommentCounter.component';
import T from '../../../base/T';
import Share from '../../../base/Share';
import Text from '../../../base/Text';
import FollowButton from '../../button/FollowButton';
import PrintButton from '../../button/PrintButton';

export const ListInfo = ({list, isListOwner, commentsListRef}) => {
  return (
    <div className="lys-graa position-relative">
      {list.image && (
        <div>
          <img
            className="w-100"
            src={`/v1/image/${list.image}/719/400`}
            alt=""
          />
        </div>
      )}

      <div className="list-info pl-3 pr-3">
        <div className="list-owner d-flex justify-content-between align-items-start">
          <ProfileImage id={list._owner} size={'40'} namePosition="right" />
          <Share
            className="align-self-center"
            href={'https://laesekompas.dk/lister/' + list._id}
            title={T({component: 'share', name: 'shareOnFacebook'})}
          >
            Del
          </Share>
        </div>

        {list.description.length > 0 ? (
          <div className="list-pr pt-3 pb-4">
            <Text type="body" data-cy="listinfo-description">
              {list.description}
            </Text>
          </div>
        ) : (
          <div className="pb-4" />
        )}
        <React.Fragment>
          <div className="list-divider m-0" />
          <div className="list-interactions d-flex flex-row-reverse justify-content-between">
            <div style={{display: 'flex'}}>
              {list._public && (
                <FollowButton disabled={isListOwner} _id={list._id} />
              )}
              <PrintButton _id={list._id} className="ml-sm-4" />
            </div>
            <div />
            {list.social && (
              <CommentCounter id={list._id} commentsListRef={commentsListRef} />
            )}
          </div>
        </React.Fragment>
      </div>
    </div>
  );
};

export const mapDispatchToProps = dispatch => ({
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
              _public: true
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
  null,
  mapDispatchToProps
)(ListInfo);
