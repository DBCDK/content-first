import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../general/ImageUpload.component';
import UserProfileForm from './UserProfileForm.component';
import Spinner from '../general/Spinner.component';
import Link from '../general/Link.component';
import LogoutLink from '../general/Logout.component';
import {
  ADD_PROFILE_IMAGE,
  SAVE_USER_PROFILE,
  DELETE_USER_PROFILE
} from '../../redux/user.reducer';

export class CreateProfilePage extends React.Component {
  render() {
    const isDeleting = this.props.isDeleting || false;

    if (isDeleting) {
      return <Spinner className="spinner-deleteProfile" size="36px" />;
    }

    return (
      <div className="container">
        <div className="profile-page tl">
          <h1 className="headline mt2">{this.props.title}</h1>
          <div className="profile-form mb3">
            {this.props.isLoading ? (
              <div className="mb2 tc">
                <Spinner size="36px" />
              </div>
            ) : (
              <div className="row clearfix m-0">
                <div className="col-3">
                  <ImageUpload
                    error={this.props.imageError}
                    style={{borderRadius: '50%'}}
                    loading={this.props.imageIsLoading}
                    previewImage={
                      this.props.profileImageId
                        ? `/v1/image/${this.props.profileImageId}/150/150`
                        : null
                    }
                    buttonText={
                      this.props.profileImageId
                        ? 'Skift profilbillede'
                        : 'Upload profilbillede'
                    }
                    onFile={this.props.addImage}
                  />
                </div>
                <div className="col-9 mb2">
                  <p className="mb2">
                    <b>Indtast dine personlige oplysninger:</b>
                  </p>
                  <div className="mb2">
                    <UserProfileForm
                      imageId={this.props.profileImageId}
                      name={this.props.name}
                      acceptedTerms={this.props.acceptedTerms}
                      library={this.props.agencyName || <Spinner size="12px" />}
                      updateProfile={this.props.saveUser}
                      error={this.props.error}
                      isSaving={this.props.isSaving}
                      editMode={this.props.editMode}
                    />
                  </div>
                  {this.props.editMode ? (
                    <React.Fragment>
                      <Link
                        href="#!"
                        className="text-danger profile-delete"
                        onClick={() => this.props.confirmDeleteModal()}
                      >
                        Slet profil
                      </Link>
                      {' | '}
                      <Link href="/profile">Fortryd redigéring</Link>
                    </React.Fragment>
                  ) : (
                    <LogoutLink>
                      Jeg ønsker alligevel ikke at oprette en profil
                    </LogoutLink>
                  )}
                </div>
              </div>
            )}
          </div>
          <div id="terms" className="terms">
            Her skal stå regler for anvendelse af læsekompasset...
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  name: state.userReducer.name,
  acceptedTerms: state.userReducer.acceptedTerms,
  isLoading: state.userReducer.isLoading,
  isSaving: state.userReducer.isSaving,
  isDeleting: state.userReducer.isDeleting,
  profileImageId: state.userReducer.tempImageId || state.userReducer.image,
  imageIsLoading: state.userReducer.profileImageIsLoading,
  error: state.userReducer.saveUserError,
  imageError: state.userReducer.imageError,
  agencyName: state.userReducer.agencyName
});
export const mapDispatchToProps = dispatch => {
  const closeModal = (type, modal) => dispatch({type, modal});
  const deleteUser = type => dispatch({type});

  return {
    addImage: image => dispatch({type: ADD_PROFILE_IMAGE, image}),
    saveUser: user => dispatch({type: SAVE_USER_PROFILE, user}),
    closeModal,
    confirmDeleteModal: () => {
      dispatch({
        type: 'OPEN_MODAL',
        modal: 'confirm',
        context: {
          title: 'Er du sikker på du vil slette din profil?',
          reason:
            'Du er ved at slette din profil og alt data som er tilknyttet den, Er du sikke rpå du vil fortsætte?.',
          confirmText: 'Slet min profil',
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
