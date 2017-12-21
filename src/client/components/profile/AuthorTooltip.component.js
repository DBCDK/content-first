import React from 'react';

const AuthorTooltip = author => (
  <div>
    <h4>{author.label}</h4>
    <div className="flex-grid tight authors">{author.byline}</div>
    <h4>genrer:</h4>
    <div className="flex-grid tight">
      {author.genres.map(mood => (
        <span key={mood} className="tag small tag-orange">
          {mood}
        </span>
      ))}
    </div>
    <h4>Kan lide:</h4>
    <div className="flex-grid flex-grid-3">
      {author.likes.map(pid => (
        <img
          key={pid}
          className="card-like"
          src={`https://content-first.demo.dbc.dk/v1/image/${pid}`}
          alt={pid}
        />
      ))}
    </div>
  </div>
);

export default AuthorTooltip;
