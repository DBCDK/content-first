import React from 'react';

const WorkItem = (props) => {
  return (
    <div className='work' id={`work-${props.id}`}>
      <div className='cover-image-wrapper'>
        {props.work.links && <img alt="" className='cover-image' src={props.work.links.cover}/>}
      </div>
      <div className='metakompas-description'>
        {props.work.book.description}
      </div>
    </div>
  );
};
export default WorkItem;
