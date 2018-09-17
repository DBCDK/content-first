import React from 'react';
import {connect} from 'react-redux';
import Textarea from 'react-textarea-autosize';
import {
  updateList,
  storeList,
  ADD_LIST_IMAGE,
  getListByIdSelector
} from '../../../../redux/list.reducer';
import ProfileImage from '../../../general/ProfileImage.component';
import SocialShareButton from '../../../general/SocialShareButton.component';
import Comments from '../../../comments/Comment.container';
import timeToString from '../../../../utils/timeToString';
import textParser from '../../../../utils/textParser';
import Heading from '../../../base/Heading';
import Paragraph from '../../../base/Paragraph';
import ImageUpload from '../../../general/ImageUpload.component';
import FollowButton from '../../button/FollowButton';
import AddBookButton from '../../button/AddBookButton';
import ListContextMenu from '../../menu/ListContextMenu';
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
  onEdit
}) => {
  return (
    <div className="box-shadow">
      <div className="list-cover-image-wrapper pl-0 pb-4 pt-md-4 pl-md-4 pr-md-4 lys-graa">
        {editing ? (
          <ImageUpload
            error={list.imageError}
            style={{borderRadius: 0, border: 0, width: '100%', height: '100%'}}
            loading={list.imageIsLoading}
            handleLoaded={this.onResize}
            previewImage={list.image ? `/v1/image/${list.image}/719/400` : null}
            buttonText="Skift billede"
            buttonPosition="inside"
            onFile={img => {
              addImage(list._id, img);
            }}
          />
        ) : (
          <img
            className="list-cover-image w-100"
            alt=""
            src={`/v1/image/${list.image}/719/400`}
          />
        )}
      </div>
      <div className="pl-3 pr-3 pl-sm-4 pr-sm-4 pb-4 lys-graa pt-2 position-relative">
        <div
          className="d-flex flex-row position-absolute pr-0"
          style={{right: 0, top: 0}}
        >
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
          <ListContextMenu
            _id={list._id}
            className="d-lg-none align-middle"
            title=""
            onEdit={onEdit}
          />
        </div>

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
              placeholder="Listens titel"
              onChange={onTitleChange}
              value={list.title}
            />
            {!(list.title && list.title.trim()) && (
              <Paragraph className="mt-2" style={{color: 'red'}}>
                Listen skal have en titel
              </Paragraph>
            )}
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
              placeholder="Fortæl om listen"
              onChange={onDescriptionChange}
              value={list.description}
            />
          </React.Fragment>
        ) : (
          <Paragraph>
            {' '}
            <span
              dangerouslySetInnerHTML={{
                __html: textParser(list.description || '')
              }}
            />
          </Paragraph>
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
  onDescriptionChange: e =>
    dispatch(updateList({_id: ownProps._id, description: e.target.value})),
  onTitleChange: e =>
    dispatch(updateList({_id: ownProps._id, title: e.target.value})),
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
