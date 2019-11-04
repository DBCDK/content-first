import React from 'react';
import Spinner from '../general/Spinner/Spinner.component';
import T from '../base/T';

export default class ProfileUpdateUser extends React.Component {
  onSubmit = e => {
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

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.setState({name: this.props.name});
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({name: props.name});
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
      <div className="d-flex">
        <div className="profile__accept-buttonbuffer" />
        <button
          className={'btn Button profile__accept-button'}
          style={checkActive()}
          onClick={this.onSubmit}
          disabled={this.props.deactivate}
          data-cy="user-form-submit"
        >
          <T component="profile" name="acceptAndSubmit" />
          {(this.props.isSaving && (
            <Spinner size={12} color="white" style={{marginLeft: '10px'}} />
          )) ||
            ''}
        </button>
      </div>
    );
  }
}
