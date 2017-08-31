import React from 'react';

export default function Belt(props) {
  const scrollPos = props.belt.scrollOffset ? (-1 * props.belt.scrollOffset * 225) + 'px' : '0px';
  return (
    <div className='row belt text-left'>
      <div className='col-xs-12 header'>
        <h3>{props.belt.name}</h3>
      </div>
      <div className='col-xs-12 tags'>
        {props.belt.tags && props.belt.tags.map((tag, idx) => {
          return <span key={idx}>{tag}</span>;
        })}
      </div>
      {props.custom}
      <div className='belt-wrapper'>
        {props.belt.works && (
          <div className='button-wrapper col-xs-12'>
            <div className='left-btn scroll-btn' onClick={props.onScrollLeft}></div>
            <div className='right-btn scroll-btn' onClick={props.onScrollRight}></div>
          </div>
        )}
        <div className='works-wrapper col-xs-12 noselect'>
          <div className='works' style={{transform: `translate3d(${scrollPos}, 0px, 0px)`}}>
            {props.belt.works && props.belt.works.map((work, idx) => {
              return (
                <div className='work' id={`work-${idx}`} key={idx}>
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
      </div>
    </div>
  );
}
