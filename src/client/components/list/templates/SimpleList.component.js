import React from 'react';
import WorkItem from '../../work/WorkItemConnected.component';
import ProfileImage from '../../general/ProfileImage.component';
import Comments from '../../comments/Comment.container';

const SimpleListItem = ({
  book,
  description,
  profile,
  allowComments,
  listId
}) => (
  <div className="row simplelist-item mb4">
    <div className="meta col-xs-3 tc">
      <WorkItem
        work={{book}}
        showTaxonomy={false}
        workClass="work simplelist"
      />
    </div>
    <div className="meta col-xs-9">
      <h4 className="w-title h-tight">{book.title}</h4>
      <h5 className="w-creator h-tight mb2">{book.creator}</h5>

      {(description && (
        <div className="profile-description">
          <ProfileImage
            src={profile.src}
            name={profile.name}
            type="list"
            className="mb1"
          />
          <p className="t-body">{description}</p>
        </div>
      )) || <p className="t-body">{book.description}</p>}
      {allowComments ? <Comments id={`${listId}-${book.pid}`} /> : ''}
    </div>
  </div>
);

export default ({list, profile}) => {
  return (
    <div className="simplelist col-xs-12 col-md-10 col-lg-8 col-xs-offset-0 col-md-offset-1">
      <div className="row mb4">
        <div className="col-xs-3 tc">
          <ProfileImage src={'http://p-hold.com/200/200'} name="Profile Name" />
        </div>
        <div className="col-xs-9">
          <p className="t-body">{list.description}</p>
          {list.social ? <Comments id={list.id} /> : ''}
        </div>
      </div>
      <div className="list">
        {list.list.map(({book, description}) => (
          <SimpleListItem
            allowComments={list.social}
            listId={list.id}
            key={book.pid}
            book={book}
            description={description}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
};
