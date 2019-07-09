import React from 'react';
import {connect} from 'react-redux';
import Head from '../base/Head';
import T from '../base/T';
import Spinner from '../general/Spinner/Spinner.component';
import ProfileUploadImage from '../general/ProfileUploadImage.component';
import EditProfileForm from '../profile/EditProfileForm.component';
import {toast} from 'react-toastify';
import ToastMessage from '../base/ToastMessage';

import './EditProfilePage.css';

import {
  ADD_PROFILE_IMAGE,
  SAVE_USER_PROFILE,
  DELETE_USER_PROFILE
} from '../../redux/user.reducer';

export class CreateProfilePage extends React.Component {
  activateSaveButton = bool => {
    this.setState({enableButton: bool});
  };

  constructor(props) {
    super(props);
    this.state = {
      enableButton: false
    };
  }

  render() {
    let baseImage;
    if (!this.props.profileImageId && !this.props.tempImageId) {
      baseImage = '/img/general/user-placeholder-thumbnail.svg';
    }
    if (this.props.profileImageId) {
      baseImage = '/v1/image/' + this.props.profileImageId + '/150/150';
    }
    if (this.props.tempImageId) {
      baseImage = '/v1/image/' + this.props.tempImageId + '/150/150';
    }

    const showImageSection = () => {
      return (
        <div className="profile__edit-image-zone">
          <div className="profile__edit-image-upload">
            <ProfileUploadImage
              error={this.props.imageError}
              loading={this.props.imageIsLoading}
              onFile={this.props.addImage}
              baseImage={baseImage}
              thumbnailImageHover={
                '/img/general/user-placeholder-thumbnail-hover.svg'
              }
              activateSaveButton={this.activateSaveButton}
            />
          </div>
        </div>
      );
    };
    const showFormSection = () => {
      return (
        <div className="profile__edit-textfield-zone">
          <EditProfileForm
            name={this.props.name}
            agencyName={this.props.agencyName}
            imageId={this.props.tempImageId}
            confirmDelete={() => this.props.confirmDeleteModal()}
            updateProfile={this.props.saveUser}
            isSaving={this.props.isSaving}
            activateSaveButton={this.activateSaveButton}
            enableButton={this.state.enableButton}
          />
        </div>
      );
    };

    const isDeleting = this.props.isDeleting || false;

    if (isDeleting) {
      return <Spinner className="spinner-deleteProfile" size="36px" />;
    }

    return (
      <div className="profile__edit-content">
        <Head
          title={'Min profil'}
          canonical="/profil/rediger"
          robots="noindex"
        />
        <div className="profile__edit-titlezone">
          <h1 className="profile__edit-title">
            <T component="profile" name="editProfile" />
          </h1>
        </div>
        <div className="profile__edit-page-position">
          <div className="profile__edit-top-position">
            {showImageSection()}
            {showFormSection()}
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  name: state.userReducer.name,
  isLoading: state.userReducer.isLoading,
  isSaving: state.userReducer.isSaving,
  isDeleting: state.userReducer.isDeleting,
  profileImageId: state.userReducer.image,
  tempImageId: state.userReducer.tempImageId,
  imageIsLoading: state.userReducer.profileImageIsLoading,
  error: state.userReducer.saveUserError,
  imageError: state.userReducer.imageError,
  agencyName: state.userReducer.agencyName
});

export const mapDispatchToProps = dispatch => {
  const closeModal = (type, modal) => dispatch({type, modal});
  const deleteUser = type => dispatch({type});
  const showToast = () => {
    toast(
      <ToastMessage
        type="success"
        icon="check_circle"
        lines={[<T component="profile" name="saveProfileToast" />]}
      />,
      {pauseOnHover: true}
    );
  };

  return {
    addImage: image => {
      dispatch({type: ADD_PROFILE_IMAGE, image});
    },
    saveUser: user => {
      dispatch(
        {
          type: SAVE_USER_PROFILE,
          user
        },
        showToast()
      );
    },
    closeModal,
    confirmDeleteModal: () => {
      dispatch({
        type: 'OPEN_MODAL',
        modal: 'confirm',
        context: {
          title: <T component="profile" name="deleteProfileModalTitle" />,
          reason: (
            <T component="profile" name="deleteProfileModalDescription" />
          ),
          confirmText: <T component="profile" name="deleteMyProfile" />,
          onConfirm: () => {
            closeModal('CLOSE_MODAL', 'confirm');
            deleteUser(DELETE_USER_PROFILE);
          },
          onCancel: () => closeModal('CLOSE_MODAL', 'confirm')
        }
      });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProfilePage);
