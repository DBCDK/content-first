import React from 'react';
import {connect} from 'react-redux';
import Textarea from 'react-textarea-autosize';
import {
  updateList,
  storeList,
  ADD_LIST_IMAGE,
  getListByIdSelector
} from '../../../../redux/list.reducer';
import {getUser} from '../../../../redux/users';
import ProfileImage from '../../../general/ProfileImage.component';
import SocialShareButton from '../../../general/SocialShareButton.component';
import Comments from '../../../comments/Comment.container';
import timeToString from '../../../../utils/timeToString';
import textParser from '../../../../utils/textParser';
import Title from '../../../base/Title';
import Text from '../../../base/Text';
import ImageUpload from '../../../general/ImageUpload.component';
import FollowButton from '../../button/FollowButton';
import AddBookButton from '../../button/AddBookButton';
import ListContextMenu from '../../menu/ListContextMenu';
import Pulse from '../../../pulse/Pulse.component';

const getListById = getListByIdSelector();

function percentageObjToPixel(e, pos) {
  const x = (Number(pos.x) * e.width) / 100;
  const y = (Number(pos.y) * e.height) / 100;
  return {x, y};
}

function pixelObjToPercentage(e, pos) {
  const x = (Number(pos.x) / e.width) * 100;
  const y = (Number(pos.y) / e.height) * 100;
  return {x, y};
}

export const ListInfo = ({
  list,
  profile,
  editing,
  onSubtitleChange,
  onTitleChange,
  onLeadChange,
  onDescriptionChange,
  onUrlTextChange,
  updatePulsePositions,
  addImage,
  confirmShareModal,
  onAddBook,
  onEdit,
  infoRef,
  sticky,
  expanded,
  info,
  expandClick
}) => {
  const height = info.height ? info.height : 'auto';
  const width = info.width ? info.width : '0';
  const top = info.top ? info.top : 'auto';

  const stickyClass = sticky && !editing ? 'box-shadow scale sticky' : '';
  const expandedClass = expanded && !editing ? ' expanded' : '';

  return (
    <React.Fragment>
      <div className={'box-shadow'}>
        {list.image && (
          <React.Fragment>
            <div
              style={{height: top + 'px'}}
              className="list-cover-content-hider position-fixed bg-white w-100"
            />
            <div
              style={{width}}
              onClick={expandClick}
              className={
                'list-cover-image-wrapper pl-0 pb-4 position-absolute pt-md-4 pl-md-4 pr-md-4 lys-graa ' +
                stickyClass +
                expandedClass
              }
            >
              <div className="position-relative w-100 h-1">
                {list.list.map(work => {
                  return (
                    <Pulse
                      dragContainer={'parent'}
                      position={percentageObjToPixel(info, work.position)}
                      draggable={editing}
                      pid={work.pid}
                      label={editing ? work.book.title : false}
                      key={'pulse-' + work.pid}
                      onStart={e => {
                        e.preventDefault();
                      }}
                      onStop={(e, ui) => {
                        const pos = pixelObjToPercentage(info, {
                          x: ui.x,
                          y: ui.y
                        });
                        const newList = list.list.map(b => {
                          if (b === work) {
                            work.position = pos;
                          }
                          return b;
                        });
                        updatePulsePositions(newList);
                      }}
                    />
                  );
                })}

                {editing ? (
                  <ImageUpload
                    error={list.imageError}
                    style={{
                      borderRadius: 0,
                      border: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    loading={list.imageIsLoading}
                    handleLoaded={this.onResize}
                    previewImage={
                      list.image ? `/v1/image/${list.image}/719/400` : null
                    }
                    buttonText="Skift billede"
                    buttonPosition="inside"
                    onFile={img => {
                      addImage(list._id, img);
                    }}
                  />
                ) : (
                  list.image && (
                    <img
                      className={'list-cover-image w-100'}
                      alt=""
                      src={`/v1/image/${list.image}/719/400`}
                    />
                  )
                )}
              </div>
            </div>
          </React.Fragment>
        )}
        <div
          ref={infoRef}
          className="list-cover-image-wrapper position-relative pl-0 pb-4 pt-md-4 pl-md-4 pr-md-4 lys-graa "
        >
          <img
            className="list-cover-image w-100"
            alt=""
            src={`/v1/image/${list.image}/719/400`}
          />
        </div>
        <div className="info pl-3 pr-3 pl-sm-4 pr-sm-4 pb-4 lys-graa pt-2 position-relative">
          <div
            className="d-flex flex-row position-absolute pr-0"
            style={{right: 0, top: 0}}
          >
            {!editing && (
              <SocialShareButton
                className={'ssb-fb align-middle mr-4'}
                facebook={true}
                href={'https://content-first.demo.dbc.dk/lister/' + list._id}
                hex={'#3b5998'}
                size={40}
                shape="round"
                hoverTitle="Del på facebook"
                status={!list.public || editing ? 'passive' : 'active'}
                onClick={() => {
                  confirmShareModal(list._id);
                }}
              />
            )}
            <ListContextMenu
              _id={list._id}
              className="d-lg-none align-middle"
              title=""
              onEdit={onEdit}
            />
          </div>

          {editing ? (
            <React.Fragment>
              <Textarea
                className={`mt-3 form-control fersken-txt Text Text__micro`}
                name="list-description"
                placeholder="Listens undertitel"
                onChange={onSubtitleChange}
                value={list.subtitle}
              />

              <Textarea
                className={`mt-3 form-control d-inline w-100 Title Title__title3`}
                name="list-description"
                onChange={onTitleChange}
                placeholder="Listens titel"
                value={list.title || ''}
              />

              {!(list.title && list.title.trim()) && (
                <Text type="body" variant="color-fersken" className="mt-2">
                  Listen skal have en titel
                </Text>
              )}

              <Textarea
                className={`mt-3 form-control Text Text__large`}
                name="list-description"
                onChange={onLeadChange}
                placeholder="Hvad handler listen om"
                value={list.lead || ''}
              />

              <Textarea
                className={`form-control mt-4 comment-textarea`}
                name="list-description"
                placeholder="Fortæl om listen"
                onChange={onDescriptionChange}
                value={list.description}
              />

              <Textarea
                className={`mt-3 form-control Text Text__large`}
                name="list-description"
                placeholder="Listens link tekst"
                onChange={onUrlTextChange}
                value={list.urlText}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text type="micro" className="mb-0">
                {list.subtitle}
              </Text>

              <Title Tag="h1" type="title3" className="d-inline">
                {list.title}
              </Title>

              <Text type="large" className="mt-3">
                {list.lead}
              </Text>

              <Text type="body">
                <span
                  dangerouslySetInnerHTML={{
                    __html: textParser(list.description || '')
                  }}
                />
              </Text>
            </React.Fragment>
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
            disabled={editing}
          />
        )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    list,
    editing: list.editing || list.isNew,
    profile: getUser(state, {id: list._owner})
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  addImage: (_id, image) => dispatch({type: ADD_LIST_IMAGE, image, _id}),

  onSubtitleChange: e =>
    dispatch(updateList({_id: ownProps._id, subtitle: e.target.value})),
  onTitleChange: e =>
    dispatch(updateList({_id: ownProps._id, title: e.target.value})),
  onLeadChange: e =>
    dispatch(updateList({_id: ownProps._id, lead: e.target.value})),
  onDescriptionChange: e =>
    dispatch(updateList({_id: ownProps._id, description: e.target.value})),
  onUrlTextChange: e =>
    dispatch(updateList({_id: ownProps._id, urlText: e.target.value})),
  updatePulsePositions: list => dispatch(updateList({_id: ownProps._id, list})),

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
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListInfo);
