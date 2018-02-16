import React from 'react';
import ImageUpload from '../general/ImageUpload.component';
import UserProfileForm from './UserProfileForm.component';
import Spinner from '../general/Spinner.component';
import {connect} from 'react-redux';
import {ADD_PROFILE_IMAGE, SAVE_USER_PROFILE} from '../../redux/user.reducer';

export class CreateProfilePage extends React.Component {
  render() {
    return (
      <div className="profile-page tl raleway">
        <h1 className="headline mb2">Opret profil</h1>
        <div className="profile-form mb3">
          {this.props.isLoading ? (
            <div className="mb2 tc">
              <Spinner size="36px" />
            </div>
          ) : (
            <div className="rows clearfix">
              <div className="col-xs-3">
                <ImageUpload
                  error={this.props.imageError}
                  style={{borderRadius: '50%'}}
                  loading={this.props.imageIsLoading}
                  previewImage={
                    this.props.profileImageId
                      ? `/v1/image/${this.props.profileImageId}/150/150`
                      : null
                  }
                  onFile={this.props.addImage}
                />
              </div>
              <div className="col-xs-9">
                <p className="mb2">
                  <b>Indtast dine personlige oplysninger:</b>
                </p>
                <UserProfileForm
                  imageId={this.props.profileImageId}
                  name={this.props.name}
                  acceptedTerms={this.props.acceptedTerms}
                  library={this.props.agencyName || <Spinner size="12px" />}
                  updateProfile={this.props.saveUser}
                  error={this.props.error}
                  isSaving={this.props.isSaving}
                />
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateProfilePage);
