import React from 'react';
import Spinner from '../general/Spinner.component';

export default class UserProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || '',
      acceptedTerms: props.acceptedTerms
    };
  }

  onSubmit = e => {
    e.preventDefault();
    if (!this.state.acceptedTerms) {
      return this.setState({
        validationError:
          'For at oprette en profil, skal du acceptere reglerne for anvendelse af Læsekompasset.'
      });
    }
    if (this.state.name.length < 4) {
      return this.setState({
        validationError: 'Dit brugernavn skal være minimum hep karakterer langt'
      });
    }
    this.setState({validationError: null});
    this.props.updateProfile({
      name: this.state.name,
      acceptedTerms: this.state.acceptedTerms,
      image: this.props.imageId
    });
  };

  renderErrors() {
    const error =
      this.state.validationError ||
      (this.props.error ? 'Det er ikke muligt at gemme profilen' : null);
    if (error) {
      return <div className="error mb2">{error}</div>;
    }
  }

  render() {
    return (
      <form
        className="profile-form mb4"
        style={{maxWidth: '400px'}}
        onSubmit={this.onSubmit}
      >
        <div
          className={`input-group mb2 ${(this.state.name.length > 3 &&
            'has-success') ||
            ((this.state.name.length === 0 && ' ') ||
              'has-error')} has-feedback`}
        >
          <input
            className="form-control mb3"
            type="text"
            name="name"
            placeholder="Vælg brugernavn"
            value={this.state.name}
            onChange={e => this.setState({[e.target.name]: e.target.value})}
          />
          <span
            className={`form-control-feedback glyphicon ${(this.state.name
              .length > 3 &&
              'glyphicon-ok') ||
              ((this.state.name.length === 0 && ' ') || 'glyphicon-remove')}`}
            aria-hidden="true"
          />
        </div>
        <p className="mb6">Du er logget på via {this.props.library}</p>
        <label htmlFor="acceptedTerms" className="checkbox">
          <input
            id="acceptedTerms"
            className="checkbox"
            name="acceptedTerms"
            type="checkbox"
            disabled={this.props.isSaving}
            checked={this.state.acceptedTerms}
            onChange={() =>
              this.setState({acceptedTerms: !this.state.acceptedTerms})
            }
          />
          <span /> Jeg har læst og accepteret{' '}
          <a href="#terms">reglerne for anvendelse af Læsekompasset</a>
        </label>
        {this.renderErrors()}
        <button
          className="btn btn-success btn-block"
          disabled={this.props.isSaving}
        >
          Opret profil{' '}
          {(this.props.isSaving && (
            <Spinner size={12} color="white" style={{marginLeft: '10px'}} />
          )) ||
            ''}
        </button>
      </form>
    );
  }
}
