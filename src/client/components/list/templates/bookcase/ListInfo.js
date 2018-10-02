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
import ImageUpload from '../../../general/ImageUpload.component';
import FollowButton from '../../button/FollowButton';
import AddBookButton from '../../button/AddBookButton';
import ListContextMenu from '../../menu/ListContextMenu';
import Pulse from '../../../pulse/Pulse.component';

const getListById = getListByIdSelector();

const dotColors = ['korn', 'due', 'de-york', 'fersken', 'petrolium'];

function percentageObjToPixel(e, pos) {
  const x = (pos.x * e.imgWidth) / 100;
  const y = (pos.y * e.imgHeight) / 100;
  return {x, y};
}

function pixelObjToPercentage(e, pos) {
  const x = (pos.x / e.imgWidth) * 100;
  const y = (pos.y / e.imgHeight) * 100;
  return {x, y};
}

export const ListInfo = ({
  list,
  editing,
  onSubtitleChange,
  onTitleChange,
  onLeadChange,
  onDescriptionChange,
  onUrlTextChange,
  onColorChange,
  updatePulsePositions,
  addImage,
  confirmShareModal,
  onAddBook,
  onEdit,
  infoRef,
  sticky,
  expanded,
  info,
  expandClick,
  pulseClick
}) => {
  const height = editing ? 'auto' : info.height;
  const width = editing ? '100%' : info.width;

  const padding = expanded ? info.padding : '0';

  const notSticky = !sticky ? 'slideUp pl-0 pb-4 pt-md-4 pl-md-4 pr-md-4' : '';
  const stickyClass = sticky && !editing ? ' scale sticky' : '';
  const expandedClass = expanded && !editing ? ' expanded' : '';

  return (
    <div className={'box-shadow position-relative'}>
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
                  draggable={editing}
                  label={editing ? work.book.title : false}
                  key={'pulse-' + work.pid}
                  color={list.dotColor || false}
                  onClick={() => {
                    if (!editing) {
                      return pulseClick(work.pid);
                    }
                  }}
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
              className="w-100"
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
                alt=""
                className={'list-cover-image w-100'}
                src={`/v1/image/${list.image}/719/400`}
              />
            )
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
          />
        )}
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
            <div className="info-color-select d-flex flex-row-reverse position-relative">
              {dotColors.map((color, i) => {
                const active = color === list.dotColor ? true : false;
                const disableClass = !active ? 'pulse-expand-disable' : '';

                return (
                  <Pulse
                    className={'ml-2 ' + disableClass}
                    dragContainer={'parent'}
                    draggable={false}
                    pid={false}
                    label={false}
                    color={color}
                    active={active}
                    key={'pulse-' + i}
                    onClick={() => onColorChange(color)}
                  />
                );
              })}
            </div>

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

            <Title Tag="h1" type="title3">
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
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});

  return {
    list,
    editing: list.editing || list.isNew
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
  onColorChange: color =>
    dispatch(updateList({_id: ownProps._id, dotColor: color})),
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
