import React from 'react';
import {connect} from 'react-redux';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {ProfileInput} from '../profile/ProfileInput.component';
import ProfileUploadImage from '../general/ProfileUploadImage.component';

import {
  ADD_PROFILE_IMAGE,
  ON_LOGOUT_REQUEST,
  SAVE_USER_PROFILE
} from '../../redux/user.reducer';

import ProfileUpdateUser from '../profile/ProfileUpdateUser.component';

export class ProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'accept',
      username: '',
      showNameInfo: false
    };
  }

  componentDidMount() {
    this.setState({username: !this.props.username ? '' : this.props.username});
  }

  render() {
    const onHandleChange = val => {
      this.setState({username: val, showNameInfo: val.length < 4});
    };

    const updateProfile = (e, obj) => {
      // submit
      console.log('obj', obj);
      e.preventDefault();
      this.props.saveUser(obj);
      this.props.onClose();
    };

    const onBackButton = () => {
      this.setState({page: 'accept'});
    };

    const onShowRules = () => {
      this.setState({page: 'rules'});
    };

    const closeWindowAndLogout = () => {
      this.props.onClose();
      this.props.logout();
    };

    const showAgeLimitWindow = () => {
      return (
        <div className="modal-window profile__ageLimit-window">
          <div className="profile__accept-margins">
            <div className="profile__ageLimit-scroll">
              <div className="profile__ageLimit-title1">
                DU HAR IKKE TILLADELSE TIL AT OPRETTE EN PROFIL PÅ LÆSEKOMPASSET
              </div>

              <div className="profile__ageLimit-content">
                Vi har fået information om, at du er under 13 år, og derfor ikke
                har tilladelse til at oprette en profil. Du kan stadig bruge Min
                næste bog, til at finde skønlitteratur, men det er desværre ikke
                muligt at låne en bog og laver lister. Hvis du gerne vil låne
                bøger kan du stadig gøre det gennem
                <a
                  href="https://www.bibliotek.dk"
                  target="_blank"
                  className="profile__ageLimit-link"
                >
                  {' '}
                  bibliotek.dk.
                </a>
                <br />
                <br />
                Har vi fået forkerte informationer, og er du over 13 år, så
                henvend dig til
                <a
                  href="https://kundeservice.dbc.dk/"
                  target="_blank"
                  className="profile__ageLimit-link"
                >
                  {' '}
                  DBCs kundeservice.{' '}
                </a>
              </div>
              <div className="profile__line" />
              <div style={{textAlign: 'right'}}>
                <button
                  className="btn Button profile__accept-button"
                  onClick={closeWindowAndLogout}
                  data-cy="user-form-submit"
                  style={{backgroundColor: 'var(--korn)'}}
                >
                  Log Ud
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
    const showAcceptWindow = () => {
      const getInfoClass = () => {
        if (!this.state.showNameInfo) {
          return '-disabled';
        }
        return '';
      };
      return (
        <div className={'profile__modal-window'}>
          <div className="profile__accept-window">
            <div className="profile__accept-margins">
              <div className="profile__accept-title1">
                FØRSTE GANG DU BRUGER LÆSEKOMPASSET …
              </div>

              <div>
                <div className="profile__accept-title2">
                  … skal du acceptere
                  <a
                    style={{cursor: 'pointer', color: 'var(--malibu)'}}
                    onClick={onShowRules}
                  >
                    {' '}
                    regler og vilkår for anvendelse af Læsekompasset{' '}
                  </a>
                  , der kort fortalt anvendes til at gøre dit indhold mere
                  personaliseret.
                </div>

                <div className="profile__accept-inputZone">
                  <div className="profile__accept-nameAndImg">
                    Hvad skal vi kalde dig?
                    <p />
                    <div style={{display: 'inline-flex'}}>
                      <ProfileUploadImage
                        error={this.props.imageError}
                        style={{borderRadius: '50%'}}
                        loading={this.props.imageIsLoading}
                        personalImage={
                          this.props.profileImageId
                            ? `/v1/image/${this.props.profileImageId}/150/150`
                            : null
                        }
                        tempPersonalImage={
                          this.props.tempImageId
                            ? `/v1/image/${this.props.tempImageId}/150/150`
                            : null
                        }
                        buttonText={
                          this.props.profileImageId
                            ? 'Skift profilbillede'
                            : 'Upload profilbillede'
                        }
                        onFile={this.props.addImage}
                        thumbnailImage={
                          '/img/general/user-placeholder-thumbnail.png'
                        }
                        thumbnailImageHover={
                          '/img/general/user-placeholder-thumbnail-hover.png'
                        }
                      />

                      <div>
                        <div className="profile__accept-inputNameTitle">
                          Brugernavn
                        </div>
                        <div className="input-group mb2 has-feedback">
                          <ProfileInput
                            username={this.state.username}
                            onInputChange={onHandleChange}
                          />
                          <div
                            className={'profile__name-info' + getInfoClass()}
                          >
                            Min. 4 tegn
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile__accept-boxTriangle" />

                  <div className="profile__accept-box">
                    <div className="profile__accept-boxTitle">
                      Hvad skal vi bruge det til?
                    </div>

                    <div className="profile__accept-boxText">
                      <ul>
                        <li>når vi taler til dig her på siden</li>
                        <li>når du deler dine lister</li>
                        <li>når du kommeterer på andres lister</li>
                        <li>give dig mere personaliseret indhold</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="profile__accept-line" />
                <ProfileUpdateUser
                  imageId={this.props.profileImageId}
                  name={this.state.username}
                  acceptedAge={this.props.over13}
                  acceptedTerms={this.props.acceptedTerms}
                  updateProfile={updateProfile}
                  error={this.props.error}
                  isSaving={this.props.isSaving}
                  editMode={this.props.editMode}
                  deactivate={this.state.showNameInfo}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };
    const showRulesWindow = () => {
      return (
        <div className="profile__modal-window profile__rules-window">
          <div className="profile__rules-margin">
            <div className="profile__rules-backbtn">
              <a onClick={onBackButton}>{'<  Tilbage'}</a>
            </div>
            <div className="profile__rules-line" />
            <div className="profile__rules-scroll">
              <div className="profile__rules-title1">
                REGLER FOR ANVENDELSE AF LÆSEKOMPASSET
              </div>
              <div className="profile__rules-title2">
                Læsekompas.dk er dit inspirationsværktøj til at finde ny læsning
              </div>
              <div className="profile__rules-content">
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
              </div>

              <div className="profile__rules-title2">
                Beta-version af læsekompas.dk
              </div>
              <div className="profile__rules-content">
                Læsekompas.dk er lanceret som en beta-version. Dette betyder, at
                vi fortsat tester og justerer. Den version af læsekompas.dk, du
                oplever er ikke helt færdigudviklet og du vil derfor opleve at
                løsningen udvikler sig over tid.
              </div>

              <div className="profile__rules-title2">Hvem står bag?</div>
              <div className="profile__rules-content">
                Læsekompas.dk er skabt og drives af de danske folkebiblioteker i
                samarbejde med DBC.
                <div style={{display: 'block', marginTop: '12px'}}>
                  <div>DBC as</div>
                  <div>Tempovej 7-11</div>
                  <div>2750 Ballerup</div>
                  <div>dbc@dbc.dk</div>
                </div>
              </div>

              <div className="profile__rules-title2">Brugergeneret indhold</div>
              <div className="profile__rules-content">
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
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="profile__modal-container">
        {this.state.page === 'accept' &&
          this.props.over13 &&
          showAcceptWindow(this.state.username)}
        {this.state.page === 'rules' && this.props.over13 && showRulesWindow()}
        {!this.props.over13 && showAgeLimitWindow()}
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  acceptedAge: state.userReducer.acceptedAge,
  token: state.userReducer.openplatformToken,
  id: state.userReducer.openplatformId,
  username: state.userReducer.tempname,
  imageError: state.userReducer.imageError,
  imageIsLoading: state.userReducer.profileImageIsLoading,
  profileImageId: state.userReducer.tempImageId || state.userReducer.image,
  tempImageId: state.userReducer.tempImageId,
  over13: state.userReducer.over13,
  agencyName: state.userReducer.agencyName
});

export const mapDispatchToProps = dispatch => {
  return {
    onClose: () => dispatch({type: CLOSE_MODAL, modal: 'profile'}),
    addImage: image => dispatch({type: ADD_PROFILE_IMAGE, image}),
    saveUser: user => dispatch({type: SAVE_USER_PROFILE, user}),
    logout: () => dispatch({type: ON_LOGOUT_REQUEST})
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileModal);
