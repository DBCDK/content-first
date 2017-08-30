import React from 'react';

export default function Belt(props) {
  return (
    <div className='row belt text-left'>
      <div className='col-xs-12 header'>
        <h4>{props.belt.name}</h4>
      </div>
      <div className='col-xs-12 tags'>
        {props.belt.tags && props.belt.tags.map((tag, idx) => {
          return <span key={idx}>{tag}</span>;
        })}
      </div>
      <div className='col-xs-12 works'>
        {props.belt.works && props.belt.works.map((work, idx) => {
          return (
            <div className='work' key={idx}>
              <div className='cover-image-wrapper'>
                <img className='cover-image' src={work.cover}/>
              </div>
              <div className='metakompas-description'>
                {work.metakompasDescription}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
