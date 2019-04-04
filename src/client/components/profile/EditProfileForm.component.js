import React from 'react';
import Spinner from '../general/Spinner.component';
import T from '../base/T';
import Link from '../general/Link.component';

export default class EditProfileForm extends React.Component {
  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    // Check if username is more than 4 characters
    if (this.state.name.length < 4) {
      return this.setState({
        nameTooShort: true
      });
    }

    this.props.updateProfile({
      name: this.state.name,
      image: this.props.imageId
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name || '',
      nameTooShort: false,
      image: this.props.imageId
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.setState({
        name: this.props.name,
        nameTooShort: this.props.name.length < 4
      });
    }
  }

  render() {
    const name = this.state.name ? this.state.name : '';
    const agencyName = this.props.agencyName ? this.props.agencyName : '';

    return (
      <form style={{maxWidth: '400px'}} onSubmit={this.onSubmit}>
        <div
          className={`input-group mb2 ${(name.length > 3 && 'valid-feedback') ||
            ((name.length === 0 && ' ') || 'invalid-feedback')} has-feedback`}
        >
          <div className="profile__edit-username-zone">
            <div className="profile__edit-inputNameTitle">Brugernavn</div>
            <div className="profile__edit-textfield">
              <input
                className={`profile__mobileinputfield ${(name.length > 3 &&
                  'is-valid') ||
                  ((name.length === 0 && ' ') || 'is-invalid')} has-feedback`}
                type="text"
                name="name"
                placeholder={T({
                  component: 'profile',
                  name: 'placeholderUsername'
                })}
                value={name}
                onChange={e => {
                  this.props.activateSaveButton();
                  this.setState({[e.target.name]: e.target.value});
                }}
                data-cy="user-form-name"
              />
            </div>
            {this.state.nameTooShort && (
              <div className="profile__edit-username-warning">
                <T component="profile" name="validationUsernameLength" />
              </div>
            )}
          </div>
        </div>

        <div className="profile__edit-libraryinfo">
          <p className="mb6">
            <T component="login" name="signedInby" />
            <input
              className="profile__edit-libraryname"
              type="text"
              name="name"
              value={agencyName}
              disabled
            />
          </p>
        </div>

        <div className="profile__edit-link">
          <a href="/om">Se regler og vilkår for Læsekompasset</a>
        </div>

        <div className="profile__edit-link">
          <Link href="#!" onClick={this.props.confirmDelete}>
            <T component="profile" name="deleteProfile" />
          </Link>
        </div>

        <div className="profile__edit-bottom-position">
          <div className="profile__edit-bottom-elements">
            <div className="btn profile__edit-savebtn">
              <button
                disabled={!this.props.enableButton}
                data-cy="user-form-submit"
              >
                Gem Ændringer
                {this.props.isSaving && (
                  <Spinner
                    size={12}
                    color="white"
                    style={{marginLeft: '10px'}}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
