import React from 'react';

export class ProfileInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const handleChange = (e) => {
      this.props.onInputChange(e.target.value);
    };

    return (
      <div>
        <input
          className="form-control mb3 has-feedback"
          type="text"
          name="name"
          placeholder="Skriv brugernavn"
          data-cy="user-form-name"
          value={this.props.username}
          onChange={handleChange}
        />
      </div>
    );
  }
}
