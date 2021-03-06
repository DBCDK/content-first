import React from 'react';
import T from '../base/T';

export class ProfileInput extends React.Component {
  render() {
    const handleChange = e => {
      this.props.onInputChange(e.target.value);
    };

    return (
      <input
        className="form-control mb3 profile__mobileinputfield"
        type="text"
        name="name"
        placeholder={T({
          component: 'profile',
          name: 'placeholderUsername'
        })}
        data-cy="user-form-name"
        value={this.props.username}
        onChange={handleChange}
      />
    );
  }
}
