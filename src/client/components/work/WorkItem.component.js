import React from 'react';

const WorkItem = (props) => {
  return (
    <div className='work' id={`work-${props.id}`}>
      <div className='cover-image-wrapper' style={{boxShadow: props.disableShadow ? '0px 0px 0px' : null}}>
        <img alt="" className='cover-image' src={props.work.cover}/>
      </div>
      <div className='metakompas-description'>
        {props.work.metakompasDescription}
      </div>
    </div>
  );
};
export default WorkItem;
