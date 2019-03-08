import React from 'react';
import {connect} from 'react-redux';
import Textarea from 'react-textarea-autosize';
import {
  updateList,
  storeList,
  ADD_LIST_IMAGE,
  getListByIdSelector
} from '../../../../redux/list.reducer';
import SocialShareButton from '../../../general/SocialShareButton.component';
import Comments from '../../../comments/Comment.container';
import textParser from '../../../../utils/textParser';
import Title from '../../../base/Title';
import Text from '../../../base/Text';
import T from '../../../base/T';
import ImageUpload from '../../../general/ImageUpload.component';
import FollowButton from '../../button/FollowButton';
import AddBookButton from '../../button/AddBookButton';
import ListContextMenu from '../../menu/ListContextMenu';
import Pulse from '../../../pulse/Pulse.component';
import {
  percentageObjToPixel,
  pixelObjToPercentage
} from '../../../../utils/converter.js';
const getListById = getListByIdSelector();

const dotColors = ['korn', 'due', 'de-york', 'fersken', 'petroleum'];

export class ListInfo extends React.Component {
  onPulseClick(work) {
    this.props.pulseClick(work.pid);
  }

  render() {
    const {
      list,
      editing,
      onSubtitleChange,
      onTitleChange,
      onLeadChange,
      onDescriptionChange,
      onUrlTextChange,
      onColorChange,
      addImage,
      confirmShareModal,
      onAddBook,
      onEdit,
      infoRef,
      sticky,
      expanded,
      info,
      expandClick,
      titleMissing
    } = this.props;

    const height = info.height;
    const width = info.width;
    const padding = expanded ? info.padding : '0';

    const notSticky = !sticky
      ? 'slideUp pl-0 pb-md-4 pt-md-4 pl-md-4 pr-md-4'
      : '';
    const stickyClass = sticky ? ' scale sticky' : '';
    const expandedClass = expanded ? ' expanded' : '';

    return (
      <div className={'box-shadow position-relative'}>
        <div
          style={{width, height, padding}}
          onClick={expandClick}
          className={`list-cover-image-wrapper lys-graa position-absolute ${notSticky} ${stickyClass} ${expandedClass}`}
        >
          <div className="list-cover-content-hider bg-white" />
          <div className="position-relative w-100 h-100 d-flex ">
            {list.image &&
              list.list.map(work => {
                return (
                  <Pulse
                    dragContainer={'parent'}
                    position={percentageObjToPixel(info, work.position)}
                    label={work.book.title}
                    key={'pulse-' + work.pid}
                    color={list.dotColor || false}
                    onClick={() => this.onPulseClick(work)}
                  />
                );
              })}

            {list.image && (
              <img
                alt=""
                className={'list-cover-image_ w-100'}
                src={`/v1/image/${list.image}/719/400`}
              />
            )}

            {sticky &&
              !expanded && (
                <div className="list-cover-text pt-md-4 pl-md-4 pr-md-4 pt-2 pl-3 pr-2">
                  <Text type="micro" className="mb-0">
                    <span className="display-block w-100">{list.subtitle}</span>
                  </Text>
                  <Text type="large" className="mb0">
                    <span>{list.title}</span>
                  </Text>
                </div>
              )}
          </div>
        </div>

        <div
          ref={infoRef}
          className="position-relative pl-0 pb-md-4 pt-md-4 pl-md-4 pr-md-4 lys-graa"
        >
          {list.image && (
            <img
              alt=""
              style={{opacity: 0}}
              className="list-cover-image w-100"
              src={`/v1/image/${list.image}/719/400`}
              onLoad={this.props.forceUpdate}
            />
          )}
        </div>
        <div className="info pt-4 pt-md-2 pl-3 pr-3 pl-sm-4 pr-sm-4 pb-4 lys-graa position-relative">
          <div
            className="d-flex flex-row position-absolute pr-0"
            style={{right: 0, top: 0}}
          >
            <SocialShareButton
              className={'ssb-fb align-middle mr-2 mr-md-4 mt-3 mt-md-2'}
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

          <div className="d-flex flex-row lys-graa justify-content-between d-lg-none mt-4">
            <div>
              <FollowButton _id={list._id} />
            </div>
            <div>
              <AddBookButton _id={list._id} onClick={onAddBook} />
            </div>
          </div>
        </div>
        {list.social && (
          <Comments
            className="m-0 pl-3 pl-sm-4 pr-3 pr-sm-4 pt-4 pb-0 porcelain"
            id={list._id}
            disabled={false}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});

  return {
    list
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
