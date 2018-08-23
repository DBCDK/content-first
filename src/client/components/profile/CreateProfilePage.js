import React from 'react';
import ImageUpload from '../general/ImageUpload.component';
import UserProfileForm from './UserProfileForm.component';
import Spinner from '../general/Spinner.component';
import Link from '../general/Link.component';
import LogoutLink from '../general/Logout.component';
import {connect} from 'react-redux';
import {ADD_PROFILE_IMAGE, SAVE_USER_PROFILE} from '../../redux/user.reducer';

export class CreateProfilePage extends React.Component {
  render() {
    return (
      <div className="profile-page tl raleway">
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
                  <Link href="/profile">Fortryd redigéring</Link>
                ) : (
                  <LogoutLink>
                    Jeg ønsker alligevel ikke oprette en profil
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
    );
  }
}

export const mapStateToProps = state => ({
  name: state.userReducer.name,
  acceptedTerms: state.userReducer.acceptedTerms,
  isLoading: state.userReducer.isLoading,
  isSaving: state.userReducer.isSaving,
  profileImageId: state.userReducer.tempImageId || state.userReducer.image,
  imageIsLoading: state.userReducer.profileImageIsLoading,
  error: state.userReducer.saveUserError,
  imageError: state.userReducer.imageError,
  agencyName: state.userReducer.agencyName
});
export const mapDispatchToProps = dispatch => ({
  addImage: image => dispatch({type: ADD_PROFILE_IMAGE, image}),
  saveUser: user => dispatch({type: SAVE_USER_PROFILE, user})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProfilePage);
