import React from 'react';

export const ProfileRecommendation = ({pid}) => (
  <div className="profile-recommendation">
    <img src={`https://content-first.demo.dbc.dk/v1/image/${pid}`} alt={pid} />
  </div>
);

const ProfileRecommendations = ({recommendations, isLoading = false}) => (
  <div className="profile-recommendations">
    <div className="profile-recommendations-list">
      {recommendations.map(recommendation => (
        <ProfileRecommendation
          key={recommendation.pid}
          pid={recommendation.pid}
        />
      ))}
      <div className="profile-recommendations-loading-wrapper">
        {isLoading ? (
          <span className="profile-recommendations-loading">
            <span className="spinner" />
          </span>
        ) : (
          ''
        )}
      </div>
    </div>
    <div className="profile-topbar-label text-left raleway">
      Bedste forslag til din profil
    </div>
  </div>
);

export default ProfileRecommendations;
