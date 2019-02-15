import React from 'react';
import Spinner from '../general/Spinner.component';

export default class ProfileUpdateUser extends React.Component {
  onSubmit = e => {
    // Check if usernameis more than 4 characters
    if (this.state.name.length < 4) {
      return this.setState({
        validationError: 'Dit brugernavn skal være minimum 4 karakterer langt'
      });
    }
    // Check if user accepted age (above 13)
    if (!this.state.acceptedAge) {
      return this.setState({
        validationError: 'Du skal være over 13 år for at oprette en profil'
      });
    }

    this.setState({validationError: null});

    const obj = {
      name: this.state.name,
      image: this.props.imageId
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
    let btnStyle = {};
    if (this.props.deactivate) {
      btnStyle = {
        paddingTop: '7px',
        height: '34px',
        color: 'var(--silver-chalice)',
        backgroundColor: 'var(--alto)',
        textTransform: 'Uppercase'
      };
    } else {
      btnStyle = {
        paddingTop: '7px',
        height: '34px',
        color: 'var(--petroleum)',
        backgroundColor: 'var(--korn)',
        textTransform: 'Uppercase'
      };
    }

    return (
      <div style={{display: 'flex'}}>
        {/*<p className="mb6">Du er logget på via {this.props.library}</p>*/}

        <div
          style={{
            textAlign: 'left',
            width: '282px',
            marginRight: '10px',
            marginTop: '15px',
            fontSize: '12px'
          }}
        >
          {this.renderErrors()}
        </div>
        <button
          className="mr1 mt1 btn Button Button__medium"
          onClick={this.onSubmit}
          style={btnStyle}
          disabled={this.props.deactivate}
          data-cy="user-form-submit"
        >
          {this.props.editMode ? 'Gem Profil' : 'Accepter regler og vilkår'}{' '}
          {(this.props.isSaving && (
            <Spinner size={12} color="white" style={{marginLeft: '10px'}} />
          )) ||
            ''}
        </button>
      </div>
    );
  }
}
