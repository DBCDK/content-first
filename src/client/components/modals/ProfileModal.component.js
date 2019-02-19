import React from 'react';
import {connect} from 'react-redux';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {ProfileInput} from '../profile/ProfileInput.component';
import ProfileUploadImage from '../general/ProfileUploadImage.component';

import {ADD_PROFILE_IMAGE, ON_LOGOUT_REQUEST, SAVE_USER_PROFILE} from '../../redux/user.reducer';

import Spinner from '../general/Spinner.component';
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
      //submit
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
      this.props.onClose()
      this.props.logout()
    }

    const showAgeLimitWindow = () => {
      return (
        <div
          className={'profile-rules-modal  modal-window profile__ageLimit-window'}
          style={{
            font: 'var(--primary-font)',
            borderRadius: '4px',
            color: 'var(--petroleum)',
            width: '692px',
            height: '416px',
            paddingTop: '40px',
            paddingBottom: '5px',
            display: 'flex'
          }}
        >
          <div
            className='profile__modal-margins'
            style={{
              marginLeft: '80px',
              marginRight: '80px'
            }}
          >
            <div
              className='profile__ageLimit-scroll'
              style={{
                height: '92%',
                overflowY: 'scroll'
              }}
            >
              <div
                className="profile__rules-title1"
                style={{
                  width: '530px',
                  fontSize: '21px',
                  fontWeight: '700'
                }}
              >
                DU HAR IKKE TILLADELSE TIL AT OPRETTE EN PROFIL PÅ MIN NÆSTE BOG
              </div>

              <div
                className="profile__rules-content"
                style={{
                  fontSize: '14px',
                  width: '507px',
                  fontWeight: '400',
                  paddingTop: '28px'
                }}
              >
                Vi har fået information om, at du er under 13 år, og derfor ikke
                har tilladelse til at oprette en profil. Du kan stadig bruge Min
                næste bog, til at finde skønlitteratur, men det er desværre ikke
                muligt at låne en bog og laver lister. Hvis du gerne vil låne
                bøger kan du stadig gøre det gennem
                <a
                  href="https://www.bibliotek.dk"
                  target="_blank"
                  className='profile__rule-link'
                  style={{
                    color: 'var(--petroleum)',
                    textDecoration: 'underline'
                  }}
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
                  className='profile__rule-link'
                  style={{
                    color: 'var(--petroleum)',
                    textDecoration: 'underline'
                  }}
                >
                  {' '}
                  DBCs kundeservice.{' '}
                </a>
              </div>
              <div
                className='profile__line'
                style={{
                  width: '526px',
                  borderBottom: 'solid #979797',
                  borderWidth: 'thin',
                  marginTop: '24px',
                  marginBottom: '12px'
                }}
              />
              <div style={{textAlign: 'right'}}>
                <button
                  className="mr1 mt1 btn Button Button__medium profile__btn-active"
                  onClick={closeWindowAndLogout}
                  style={{
                    paddingTop: '7px',
                    height: '34px',
                    color: 'var(--petroleum)',
                    backgroundColor: 'var(--korn)',
                    textTransform: 'Uppercase'
                  }}
                  data-cy="user-form-submit"
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
      /**/
      const getInfoClass = () => {
        if (this.state.showNameInfo) {
          return "profile__info-active"
        } else {
          return "profile__info-disabled"
        }

      }
      let infoStyle = {display: 'none'};
      if (this.state.showNameInfo) {
        infoStyle = {
          width: '200px',
          height: '24px',
          marginLeft: '7px',
          marginTop: '-28px',
          fontSize: '10px',
          fontWeight: '400',
          color: '#495057'
        };
      }
      return (
        <div className={'profile-modal modal-window profile__accept-window'}>
          <div

            style={{
              font: 'var(--primary-font)',
              borderRadius: '4px',
              color: 'var(--petroleum)',
              width: '692px',
              height: '416',
              paddingTop: '40px',
              paddingBottom: '34px'
            }}
          >
            <div
              className='profile__modal-margins'
              style={{
                marginLeft: '80px',
                marginRight: '80px'
              }}
            >
              <div
                className="profile__accept-title1"
                style={{
                  fontSize: '21px',
                  width: '529px',
                  textTransform: 'uppercase',
                  fontWeight: '700'
                }}
              >
                FØRSTE GANG DU BRUGER MIN NÆSTE BOG …
              </div>

              <div>
                <div
                  className="profile__accept-title2"
                  style={{
                    textAlign: 'center',
                    marginTop: '33px',
                    fontSize: '14px',
                    width: '507px',
                    fontWeight: '400'
                  }}
                >
                  … skal du acceptere
                  <a
                    className='profile__accept-link'
                    style={{cursor: 'pointer', color: 'var(--malibu)'}}
                    onClick={onShowRules}
                  >
                    {' '}
                    regler og vilkår for anvendelse af Læsekompasset{' '}
                  </a>
                  , der kort fortalt anvendes til at gøre dit indhold mere
                  personaliseret.
                </div>

                <div
                  className='profile__accept-inputZone'
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    fontSize: '12px',
                    textAlign: 'left',
                    marginTop: '28px',
                    marginBottom: '8px'
                  }}
                >
                  <div
                    className='profile__accept-nameAndImg'
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      width: '265px',
                      marginRight: '8px'
                    }}
                  >
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

                      <div className="profile__accept-inputNameTitle">
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '400'
                          }}
                        >
                          Brugernavn
                        </div>
                        <div
                          className="input-group mb2 has-feedback"
                          style={{width: '205px'}}
                        >
                          <ProfileInput
                            username={this.state.username}
                            onInputChange={onHandleChange}
                          />
                          <div className={"profile__name-info " + getInfoClass()} style={infoStyle}>
                            Min. 4 tegn
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className='profile__accept-box'
                    style={{
                      marginTop: '55px',
                      width: '0',
                      height: '0',
                      borderTop: '20px solid transparent',
                      borderRight: '16px solid var(--concrete)',
                      borderBottom: '20px solid transparent'
                    }}
                  />

                  <div
                    className='profile__accept-boxTriangle'
                    style={{
                      minWidth: '220px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--concrete)',
                      paddingLeft: '15px',
                      paddingTop: '10px',
                      paddingRight: '15px',
                      height: '117px'
                    }}
                  >
                    <div
                      className='profile__accept-boxTitle'
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        width: '200px'
                      }}
                    >
                      Hvad skal vi bruge det til?
                    </div>

                    <div
                      className='profile__accept-boxText'
                      style={{
                        fontSize: '10px',
                        fontWeight: '400',
                        marginLeft: '-26px'
                      }}
                    >
                      <ul>
                        <li style={{margin: '5px 0'}}>
                          når vi taler til dig her på siden
                        </li>
                        <li style={{margin: '5px 0'}}>
                          når du deler dine lister
                        </li>
                        <li style={{margin: '5px 0'}}>
                          når du kommeterer på andres lister
                        </li>
                        <li style={{margin: '5px 0'}}>
                          give dig mere personaliseret indhold
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className='profile__accept-line'
                  style={{
                    textAlign: 'right',
                    borderTop: '1px solid #979797',
                    paddingTop: '15px'
                  }}
                >
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
        </div>
      );
    };
    const showRulesWindow = () => {
      return (
        <div
          className={'profile-rules-modal  modal-window profile__rules-window'}
          style={{
            font: 'var(--primary-font)',
            borderRadius: '4px',
            color: 'var(--petroleum)',
            width: '680px',
            height: '85%',
            paddingTop: '10px',
            paddingBottom: '5px',
            display: 'flex'
          }}
        >
          <div
            className='profile__rules-margin'
            style={{
              marginLeft: '40px',
              marginRight: '40px'
            }}
          >
            <div
              className='profile__rules-backbtn'
              style={{
                fontSize: '14px',
                height: '30px',
                fontWeight: '600',
                marginLeft: '-12px',
                cursor: 'pointer'
              }}
            >
              <a onClick={onBackButton}>{'<  Tilbage'}</a>
            </div>

            <div
              className='profile__rules-line'
              style={{
                width: '680px',
                marginLeft: '-40px',
                border: 'solid 1px var(--silver-chalice)'
              }}
            />
            <div
              className='profile__rules-scroll'
              style={{
                height: '92%',
                overflowY: 'scroll'
              }}
            >
              <div
                className="profile__rules-title1"
                style={{
                  width: '600px',
                  fontSize: '24px',
                  fontWeight: '700',
                  paddingTop: '13px'
                }}
              >
                REGLER FOR ANVENDELSE AF LÆSEKOMPASSET
              </div>
              <div
                className="profile__rules-title2"
                style={{
                  width: '600px',
                  fontSize: '14px',
                  fontWeight: '600',
                  paddingTop: '17px'
                }}
              >
                Læsekompas.dk er dit inspirationsværktøj til at finde ny læsning
              </div>
              <div
                className="profile__rules-content"
                style={{
                  fontSize: '14px',
                  width: '600px',
                  fontWeight: '400',
                  paddingTop: '6px',
                  paddingBottom: '16px'
                }}
              >
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

              <div
                className="profile__rules-title2"
                style={{
                  width: '600px',
                  fontSize: '14px',
                  fontWeight: '600',
                  paddingTop: '17px'
                }}
              >
                Beta-version af læsekompas.dk
              </div>
              <div
                className="profile__rules-content"
                style={{
                  fontSize: '14px',
                  width: '600px',
                  fontWeight: '400',
                  paddingTop: '6px',
                  paddingBottom: '16px'
                }}
              >
                Læsekompas.dk er lanceret som en beta-version. Dette betyder, at
                vi fortsat tester og justerer. Den version af læsekompas.dk, du
                oplever er ikke helt færdigudviklet og du vil derfor opleve at
                løsningen udvikler sig over tid.
              </div>

              <div
                className="profile__rules-title2"
                style={{
                  width: '600px',
                  fontSize: '14px',
                  fontWeight: '600',
                  paddingTop: '17px'
                }}
              >
                Hvem står bag?
              </div>
              <div
                className="profile__rules-content"
                style={{
                  fontSize: '14px',
                  width: '600px',
                  fontWeight: '400',
                  paddingTop: '6px',
                  paddingBottom: '16px'
                }}
              >
                Læsekompas.dk er skabt og drives af de danske folkebiblioteker i
                samarbejde med DBC.
                <div style={{display: 'block', marginTop: '12px'}}>
                  <div>DBC as</div>
                  <div>Tempovej 7-11</div>
                  <div>2750 Ballerup</div>
                  <div>dbc@dbc.dk</div>
                </div>
              </div>

              <div
                className="profile__rules-title2"
                style={{
                  width: '600px',
                  fontSize: '14px',
                  fontWeight: '600',
                  paddingTop: '17px'
                }}
              >
                Brugergeneret indhold
              </div>
              <div
                className="profile__rules-content"
                style={{
                  fontSize: '14px',
                  width: '600px',
                  fontWeight: '400',
                  paddingTop: '6px',
                  paddingBottom: '16px'
                }}
              >
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
      <div className="modal-container">
        {this.state.page === 'accept' &&
        this.props.over13 &&
        showAcceptWindow(this.state.username)}
        {this.state.page === 'rules' && this.props.over13 && showRulesWindow()}
        {!this.props.over13 && !this.state.page === 'accept' && showAgeLimitWindow()}
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  acceptedAge: state.userReducer.acceptedAge,
  token: state.userReducer.openplatformToken,
  id: state.userReducer.openplatformId,
  username: state.userReducer.name,
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
