import React from 'react';

export const Badge = props => {
  return (
    <span
      style={{fontWeight: 'normal'}}
      className={`badge number ${props.className}`}
    >
      {props.value}
    </span>
  );
};

export const Comments = props => {
  return (
    <span
      style={{
        position: 'relative',
        fontSize: 10,
        fontFamily: 'var(--secondary-font)',
        ...props.style
      }}
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
          top: -2,
          left: 0,
          color: 'white',
          fontSize: 11,
          fontWeight: 'normal',
          textAlign: 'center'
        }}
        className="number"
      >
        {props.value}
      </span>
    </span>
  );
};

export const Likes = props => {
  return (
    <span
      style={{
        position: 'relative',
        fontSize: 10,
        fontFamily: 'var(--secondary-font)',
        ...props.style
      }}
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
          top: -2,
          left: 0,
          color: 'white',
          fontSize: 11,
          fontWeight: 'normal',
          textAlign: 'center'
        }}
        className="number"
      >
        {props.value}
      </span>
    </span>
  );
};
export const Share = props => {
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
        className="glyphicon glyphicon-share"
      />
    </span>
  );
};
