import React from 'react';
import {connect} from 'react-redux';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

/*
import {
  ADD_PROFILE_IMAGE,
  SAVE_USER_PROFILE,
  DELETE_USER_PROFILE
} from '../../redux/user.reducer';
*/


export function ProfileModal({onClose, onAcceptAndClose}) {

  return (
    <div className="modal-container ">
      <div className="modal-backdrop" onClick={onClose} />
      <div className={'profile-modal modal-window '}>

        <div>
          <div style={{
            font: 'var(--primary-font)',
            borderRadius: '4px',
            color: 'var(--petroleum)',
            width: '692px',
            height: '416',
            paddingTop: '40px',
            paddingBottom: '34px'
          }}>

            <div style={{
              marginLeft: '80px',
              marginRight: '80px'
            }}>
              <div style={{
                fontSize: '21px',
                width: '529px',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}>
                FØRSTE GANG DU BRUGER LÆSEKOMPASSET …
              </div>

              <div>
                <div style={{
                  textAlign: 'center',
                  marginTop: '33px',
                  fontSize: '14px',
                  maxWidth: '507px',
                  fontWeight: '400'
                }}>
                  … skal du acceptere <a href="">regler og vilkår for anvendelse af Læsekompasset </a>,
                  der kort fortalt anvendes til at gøre dit indhold mere personaliseret.
                </div>

                <div style={{
                  width: '100%',
                  display: 'inline-flex',
                  fontSize: '12px',
                  textAlign: 'left',
                  marginTop: '28px',
                  marginBottom: '36px'
                }}>

                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      width: '265px',
                      marginRight: '8px'
                    }}>
                    Hvad skal vi kalde dig?
                    <p />
                    <div style={{display: 'inline-flex'}}>
                      <div className='profile-picture'
                           style={{
                             width: '55px',
                             paddingTop: '15px'
                           }}>
                        <img style={{width: '45px'}} src="/img/general/user-placeholder-thumbnail.png" />
                      </div>
                      <div className='profile-input'>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '400'
                        }}>Profilnavn
                        </div>
                        <div className="input-group mb2 has-feedback" style={{width: '205px'}}>
                          <input className="form-control mb3 has-feedback"
                                 type="text" name="name"
                                 placeholder="Skriv profilnavn"
                                 data-cy="user-form-name" value="">
                          </input>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '55px',
                    width: '0',
                    height: '0',
                    borderTop: '20px solid transparent',
                    borderRight: '16px solid var(--concrete)',
                    borderBottom: '20px solid transparent'
                  }}>
                  </div>

                  <div style={{
                    minWidth: '220px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--concrete)',
                    paddingLeft: '15px',
                    paddingTop: '10px',
                    paddingRight: '15px'
                  }}>

                    <div style={{fontSize: '10px', fontWeight: '700', width: '200px'}}>
                      Hvad skal vi bruge det til?
                    </div>

                    <div style={{fontSize: '10px', fontWeight: '400', marginLeft: '-26px'}}>
                      <ul>
                        <li style={{margin: '5px 0'}}>når vi taler til dig her på siden</li>
                        <li style={{margin: '5px 0'}}>når du deler dine lister</li>
                        <li style={{margin: '5px 0'}}>når du kommeterer på andres lister</li>
                        <li style={{margin: '5px 0'}}>give dig mere personaliseret indhold</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                  borderTop: '1px solid #979797',
                  paddingTop: '15px'
                }}>
                  <button onClick={onAcceptAndClose} className=" mr1 mt1 btn Button Button__medium"
                          style={{
                            paddingTop: '7px',
                            height: '34px',
                            color: 'var(--silver-chalice)',
                            backgroundColor: 'var(--alto)'
                          }}>ACCEPTER REGLER OG VILKÅR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

  return {
    onClose: () => dispatch({type: CLOSE_MODAL, modal: 'profile'}),
    onAcceptAndClose: () => dispatch({type: CLOSE_MODAL, modal: 'profile'})
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileModal);
