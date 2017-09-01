import React from 'react';

export default function Belt(props) {
  const scrollPos = props.belt.scrollOffset ? (-1 * props.belt.scrollOffset * 275) + 'px' : '0px';
  return (
    <div className='row belt text-left'>
      <div className='col-xs-12 header'>
        <span className='belt-title'>{props.belt.name}</span>
        {props.belt.works && props.belt.works.length > 5 &&
          <span className='more-link btn' onClick={props.onMoreClick}>Se flere</span>}
      </div>
      <div className='col-xs-12 tags'>
        {props.belt.tags && props.belt.tags.map((tag, idx) => {
          const btnClass = tag.selected ? 'btn-success' : 'btn-default';
          return <span className={`btn ${btnClass}`} key={idx} onClick={() => {
            props.onTagClick(idx);
          }}>{tag.name}</span>;
        })}
      </div>
      {props.custom}
      <div className='belt-wrapper'>
        {props.belt.works && (
          <div className='button-wrapper col-xs-12 noselect'>
            <div className='left-btn scroll-btn text-center' onClick={props.onScrollLeft}>{'<'}</div>
            <div className='right-btn scroll-btn text-center' onClick={props.onScrollRight}>{'>'}</div>
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
