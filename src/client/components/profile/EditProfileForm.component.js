import React from 'react';
import T from '../base/T';
import Link from '../general/Link.component';
import Button from '../base/Button/Button';
import Toolbar from '../base/Toolbar/Toolbar';

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
            <div className="profile__edit-inputNameTitle">
              <T component="profile" name="usernameTitle" />
            </div>
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
          <a href="/om">
            <T component="profile" name="termsAndConditions" />
          </a>
        </div>

        <div className="profile__edit-link">
          <Link href="#!" onClick={this.props.confirmDelete}>
            <T component="profile" name="deleteProfile" />
          </Link>
        </div>

        <div className="profile__edit-bottom-position">
          <Toolbar>
            <Button
              align="right"
              type="quaternary"
              size="medium"
              style={{backgroundColor: 'var(--porcelain)'}}
              onClick={() => (window.location.href = '/')}
            >
              <T component="general" name="cancel" />
            </Button>
            <Button
              align="right"
              type="quaternary"
              size="medium"
              disabled={!this.props.enableButton}
              data-cy="user-form-submit"
            >
              <T component="profile" name="saveChanges" />
            </Button>
          </Toolbar>
        </div>
      </form>
    );
  }
}
