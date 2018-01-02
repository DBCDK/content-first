import React from 'react';

const SearchField = props => (
  <form
    className="input-group"
    style={props.style || {}}
    onSubmit={event => {
      event.preventDefault();
      props.onSearch(event.target.children[0].value);
    }}
  >
    <input className="form-control" placeholder="Søg titel/forfatter" />
    <span className="input-group-btn">
      <button
        className="btn btn-default"
        type="button"
        onClick={event =>
          props.onSearch(
            event.target.parentElement.parentElement.children[0].value
          )
        }
      >
        {props.searching ? (
          <span
            className="spinner"
            style={{
              display: 'inline-block',
              width: 12,
              height: 12
            }}
          />
        ) : (
          '🔍'
        )}
      </button>
    </span>
  </form>
);

export default SearchField;
