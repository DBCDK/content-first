import React from 'react';

const ArchetypeTooltip = archetype => (
  <div>
    <h4>Følger:</h4>
    <div className="flex-grid tight authors">
      {archetype.authors.map(author => (
        <span key={author}>{author}</span>
      ))}
    </div>
    <h4>læser:</h4>
    <div className="flex-grid tight">
      {archetype.moods.map(mood => (
        <span key={mood} className="tag small tag-orange">
          {mood}
        </span>
      ))}
    </div>
    <h4>Kan lide:</h4>
    <div className="flex-grid flex-grid-3">
      {archetype.likes.map(pid => (
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

export default ArchetypeTooltip;
