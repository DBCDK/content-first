import React from 'react';
import Spinner from '../general/Spinner.component';
import T from '../base/T';

export default class UserProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || '',
      acceptedTerms: props.acceptedTerms,
      acceptedAge: props.acceptedAge
    };
  }

  onSubmit = e => {
    e.preventDefault();
    // Check if usernameis more than 4 characters
    if (this.state.name.length < 4) {
      return this.setState({
        validationError: (
          <T component="profile" name="validationUsernameLength" />
        )
      });
    }
    // Check if user accepted age (above 13)
    if (!this.state.acceptedAge) {
      return this.setState({
        validationError: <T component="profile" name="validationAcceptAge" />
      });
    }
    // Check if user accepted Terms
    if (!this.state.acceptedTerms) {
      return this.setState({
        validationError: <T component="profile" name="validationAcceptTerms" />
      });
    }

    this.setState({validationError: null});
    this.props.updateProfile({
      name: this.state.name,
      acceptedTerms: this.state.acceptedTerms,
      acceptedAge: this.state.acceptedAge,
      image: this.props.imageId
    });
  };

  renderErrors() {
    const error =
      this.state.validationError ||
      (this.props.error ? (
        <T component="profile" name="saveProfileError" />
      ) : null);
    if (error) {
      return <div className="error mb2">{error}</div>;
    }
  }

  render() {
    return (
      <form
        className="profile-form needs-validation"
        style={{maxWidth: '400px'}}
        onSubmit={this.onSubmit}
      >
        <div
          className={`input-group mb2 ${(this.state.name.length > 3 &&
            'valid-feedback') ||
            ((this.state.name.length === 0 && ' ') ||
              'invalid-feedback')} has-feedback`}
        >
          <input
            className={`form-control mb3 ${(this.state.name.length > 3 &&
              'is-valid') ||
              ((this.state.name.length === 0 && ' ') ||
                'is-invalid')} has-feedback`}
            type="text"
            name="name"
            placeholder={T({
              component: 'profile',
              name: 'placeholderUsername'
            })}
            value={this.state.name}
            onChange={e => this.setState({[e.target.name]: e.target.value})}
            data-cy="user-form-name"
          />
          <span className={'form-control-feedback '} aria-hidden="true">
            <i className="material-icons" style={{fontSize: 18}}>
              {(this.state.name.length > 3 && 'check_circle') ||
                ((this.state.name.length === 0 && ' ') || 'not_interested')}
            </i>
          </span>
        </div>
        <p className="mb6">
          <T component="login" name="signedInby" /> {this.props.library}
        </p>

        {!this.props.acceptedAge && (
          <label
            htmlFor="acceptedAge"
            className="checkbox"
            data-cy="user-form-acceptedAge"
          >
            <input
              id="acceptedAge"
              className="checkbox"
              name="acceptedAge"
              type="checkbox"
              disabled={this.props.isSaving}
              checked={this.state.acceptedAge || false}
              onChange={() =>
                this.setState({acceptedAge: !this.state.acceptedAge})
              }
            />
            <span /> <T component="profile" name="ageCheckboxText" />
          </label>
        )}

        {!this.props.acceptedTerms && (
          <label
            htmlFor="acceptedTerms"
            className="checkbox"
            data-cy="user-form-acceptedTerms"
          >
            <input
              id="acceptedTerms"
              className="checkbox"
              name="acceptedTerms"
              type="checkbox"
              disabled={this.props.isSaving}
              checked={this.state.acceptedTerms || false}
              onChange={() =>
                this.setState({acceptedTerms: !this.state.acceptedTerms})
              }
            />
            <span />
            <T component="profile" name="termsCheckboxText" />{' '}
            <a href="#terms">
              <T component="profile" name="termsCheckboxLink" />
            </a>
          </label>
        )}

        {this.renderErrors()}
        <button
          className="btn btn-success btn-block"
          disabled={this.props.isSaving}
          data-cy="user-form-submit"
        >
          <T
            component="profile"
            name={this.props.editMode ? 'saveProfile' : 'editProfile'}
          />
          {this.props.isSaving && (
            <Spinner size={12} color="white" style={{marginLeft: '10px'}} />
          )}
        </button>
      </form>
    );
  }
}
