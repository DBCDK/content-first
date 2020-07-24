import React from 'react';
import {connect} from 'react-redux';

import {updateList, storeList} from '../../../../redux/list.reducer';
import Share from '../../../base/Share';

import Text from '../../../base/Text';
import T from '../../../base/T';

import FollowButton from '../../button/FollowButton';
import PrintButton from '../../button/PrintButton';

import Pulse from '../../../pulse/Pulse.component';
import ProfileImage from '../../../general/ProfileImage.component';
import CommentCounter from '../../../comments/CommentCounter.component';
import {percentageObjToPixel} from '../../../../utils/converter.js';

export const ListInfo = ({
  list,
  isListOwner,
  infoRef,
  sticky,
  expanded,
  info,
  expandClick,
  pulseClick,
  forceUpdate
}) => {
  const height = info.height;
  const width = info.width;
  const padding = expanded ? info.padding : '0';

  const notSticky = !sticky ? 'slideUp' : '';
  const stickyClass = sticky ? ' scale sticky' : '';
  const expandedClass = expanded ? ' expanded' : '';

  return (
    <div className={'lys-graa position-relative'}>
      <div
        style={{width, height, padding}}
        onClick={expandClick}
        className={`list-cover-image-wrapper lys-graa position-absolute ${notSticky} ${stickyClass} ${expandedClass}`}
      >
        <div className="list-cover-content-hider bg-white" />
        <div className="position-relative w-100 h-100 d-flex">
          {list.image &&
            list.list.map(work => {
              return (
                <Pulse
                  dragContainer={'parent'}
                  position={percentageObjToPixel(info, work.position)}
                  key={'pulse-' + work.pid}
                  pid={work.pid}
                  color={list.dotColor || false}
                  onClick={() => pulseClick(work.pid)}
                />
              );
            })}

          {list.image && (
            <img
              ref={infoRef}
              alt=""
              className={'list-cover-image_ w-100'}
              src={`/v1/image/${list.image}/719/400`}
            />
          )}

          {sticky && !expanded && (
            <div className="list-cover-text pt-md-4 pl-md-4 pr-md-4 pt-2 pl-3 pr-2">
              <Text type="large" className="mb0">
                <span>{list.title}</span>
              </Text>
            </div>
          )}
        </div>
      </div>

      <div ref={infoRef}>
        {list.image && (
          <img
            alt=""
            style={{opacity: 0}}
            className="list-cover-image w-100"
            src={`/v1/image/${list.image}/719/400`}
            onLoad={forceUpdate}
          />
        )}
      </div>

      <div className="list-info pl-3 pr-3">
        <div
          className="list-owner d-flex justify-content-between"
          style={{right: 0, top: 0}}
        >
          <ProfileImage id={list._owner} size={'40'} namePosition="right" />
          {list._public && (
            <Share
              className="align-self-center"
              href={'https://laesekompas.dk/lister/' + list._id}
              title={T({component: 'share', name: 'shareOnFacebook'})}
            >
              {T({component: 'share', name: 'share'})}
            </Share>
          )}
        </div>

        {list.description.length > 0 ? (
          <div className="list-pr pt-3 pb-4">
            <Text type="body">{list.description}</Text>
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

            {list.social && <CommentCounter id={list._id} />}
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
export default connect(null, mapDispatchToProps)(ListInfo);
