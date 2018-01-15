import React from 'react';

export const Comments = props => {
  return (
    <span
      style={{position: 'relative', ...props.style}}
      className={props.className}
    >
      <span
        style={{
          fontSize: 24,
          color: 'black',
          verticalAlign: 'middle'
        }}
        className="glyphicon glyphicon-comment"
      />
      <span
        style={{
          position: 'absolute',
          width: '100%',
          top: -3,
          left: 0,
          color: 'white',
          fontSize: 11,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {props.value}
      </span>
    </span>
  );
};

export const Likes = props => {
  return (
    <span
      style={{position: 'relative', ...props.style}}
      className={props.className}
    >
      <span
        style={{
          fontSize: 24,
          color: 'red',
          verticalAlign: 'middle'
        }}
        className="glyphicon glyphicon-heart"
      />
      <span
        style={{
          position: 'absolute',
          width: '100%',
          top: -3,
          left: 0,
          color: 'white',
          fontSize: 11,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {props.value}
      </span>
    </span>
  );
};
