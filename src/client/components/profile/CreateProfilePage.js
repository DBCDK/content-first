import React from 'react';
import {connect} from 'react-redux';

import ImageUpload from '../general/ImageUpload.component';
import UserProfileForm from './UserProfileForm.component';
import Heading from '../base/Heading/';
import Paragraph from '../base/Paragraph/';
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
                      acceptedAge={this.props.acceptedAge}
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
          <div className="row">
            <div id="terms" className="terms col-sm-12 col-md-6 ">
              <Heading type="lead" Tag="h2" className="mb2">
                Om læsekompas.dk
              </Heading>

              <Heading type="title" Tag="h3" className="mb0 mt2">
                Læsekompas.dk er dit inspirationsværktøj til at finde ny læsning
              </Heading>
              <Paragraph>
                Læsekompas.dk er bibliotekernes inspirationsværktøj til voksne
                læsere af skønlitteratur. Alle kan anvende Læsekompasset, men
                det kræver biblioteks-login, hvis du vil bestille bøger direkte
                i løsningen. Læsekompas.dk indeholder et udvalg af
                skønlitteratur for voksne, der er tilgængeligt til hjemlån eller
                som e-lån fra folkebiblioteker. Mængden af værker øges over tid
                og Læsekompasset sigter mod at tilbyde en bred vifte af
                litteratur. Alle værker indekseres med oplevelsesord for at gøre
                det muligt for brugere at navigere i litteratur på en ny måde.
                Der er mulighed for at fremfinde værker og bestille dem direkte
                i læsekompas.dk. Læsekompas.dk giver også brugere mulighed for
                at oprette og dele lister med bøger. Man skal være over 13 år
                for at oprette sig som bruger.
              </Paragraph>

              <Heading type="title" Tag="h3" className="mb0 mt2">
                Beta-version af læsekompas.dk
              </Heading>
              <Paragraph>
                Læsekompas.dk er lanceret som en beta-version. Dette betyder, at
                vi fortsat tester og justerer. Den version af læsekompas.dk, du
                oplever er ikke helt færdigudviklet og du vil derfor opleve at
                løsningen udvikler sig over tid.
              </Paragraph>

              <Heading type="title" Tag="h3" className="mb0 mt2">
                Hvem står bag?
              </Heading>
              <Paragraph>
                Læsekompas.dk er skabt og drives af de danske folkebiblioteker i
                samarbejde med DBC. <br /> <br /> DBC as <br /> Tempovej 7-11{' '}
                <br /> 2750 Ballerup <br /> dbc@dbc.dk
              </Paragraph>

              <Heading type="title" Tag="h3" className="mb0 mt2">
                Brugergeneret indhold
              </Heading>
              <Paragraph>
                Følgende regler gælder for indlæg og indhold, som du og andre
                brugere selv lægger på læsekompas.dk. Du er ansvarlig for, at
                dine indlæg er i overensstemmelse med den til enhver tid
                gældende lovgivning, herunder at dine indlæg ikke krænker
                tredjemands rettigheder, eksempelvis ophavsret til tekst og
                billeder. Egne fotos du uploader til Læsekompasset gøres
                tilgængelige under en creative commons licens, og du giver
                læsekompas.dk lov til at mangfoldiggøre, gøre tilgængelig for
                tredjemand og lave afledte værker. For alle informationer og alt
                materiale, du leverer til læsekompas.dk gælder, at du leverer
                det vederlagsfrit og til fri brug for læsekompas.dk.
                Læsekompas.dk kan ikke kontrollere og er ikke ansvarlig for
                indhold, som brugerne leverer, og for at du som bruger kan
                risikere at blive udsat for indhold, som du finder anstødeligt,
                fejlagtigt eller på anden måde kritisabelt. Du anerkender, at vi
                som udbyder ikke forhåndsgodkender brugernes indhold, men at vi
                har retten til uden nærmere begrundelse at fjerne enhver form
                for indhold, som offentliggøres via læsekompas.dk, hvis det er i
                modstrid med gældende lovgivning eller ordlyden af de her nævnte
                betingelser.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  name: state.userReducer.name,
  acceptedTerms: state.userReducer.acceptedTerms,
  acceptedAge: state.userReducer.acceptedAge,
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
          title: 'Er du sikker på at du vil slette din profil?',
          reason:
            'Du er ved at slette din profil og alt data som er tilknyttet den, Er du sikker på at du vil fortsætte?.',
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
