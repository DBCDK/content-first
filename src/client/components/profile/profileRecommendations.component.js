import React from 'react';

const ProfileRecommendation = ({recommendation}) => (
  <div className="profile-recommendation">
    <img src={`https://content-first.demo.dbc.dk/v1/image/${recommendation.pid}`} alt={recommendation.pid} />
  </div>
);

const ProfileRecommendations = ({recommendations}) => (
  <div className="profile-recommendations">
    <div className="profile-recommendations-list">
      {recommendations.map(recommendation => <ProfileRecommendation key={recommendation.pid} recommendation={recommendation} />)}
    </div>
    <div className="Profile-recommendations-label text-left raleway">
      Bedste forslag til din profil
    </div>
  </div>
);

export default ProfileRecommendations;
