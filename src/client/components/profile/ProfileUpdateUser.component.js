import React from 'react';
import Spinner from '../general/Spinner.component';

export default class ProfileUpdateUser extends React.Component {
  onSubmit = e => {
    // Check if username is more than 4 characters
    if (this.state.name.length < 4) {
      return this.setState({
        validationError: 'Dit brugernavn skal være minimum 4 karakterer langt'
      });
    }

    this.setState({validationError: null});

    const obj = {
      name: this.state.name,
      image: this.props.imageId,
      acceptedTerms: true
    };

    e.preventDefault();
    this.props.updateProfile(e, obj);
  };

  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      acceptedAge: props.acceptedAge
    };
  }

  componentWillReceiveProps(props) {
    this.setState({name: props.name});
  }

  renderErrors() {
    const error =
      this.state.validationError ||
      (this.props.error ? 'Det er ikke muligt at gemme profilen' : null);
    if (error) {
      return <div className="error mb2">{error}</div>;
    }
  }

  render() {
    const checkActive = () => {
      if (this.props.deactivate) {
        return {
          color: 'var(--silver-chalice)',
          backgroundColor: 'var(--alto)'
        };
      }
      return {
        color: 'var(--petroleum)',
        backgroundColor: 'var(--korn)'
      };
    };

    return (
      <div className="profile__accept-buttonzone">
        <div className="profile__accept-buttonbuffer">
          {this.renderErrors()}
        </div>
        <button
          className={'btn Button profile__accept-button'}
          style={checkActive()}
          onClick={this.onSubmit}
          disabled={this.props.deactivate}
          data-cy="user-form-submit"
        >
          {this.props.editMode ? 'Gem Profil' : 'Accepter regler og vilkår'}
          {(this.props.isSaving && (
            <Spinner size={12} color="white" style={{marginLeft: '10px'}} />
          )) ||
            ''}
        </button>
      </div>
    );
  }
}
