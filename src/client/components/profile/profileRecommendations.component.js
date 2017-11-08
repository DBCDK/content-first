import React from 'react';

const ProfileRecommendation = () => (
  <div className="profile-recommendation">
    <img src="http://via.placeholder.com/150x200" />
  </div>
);

const ProfileRecommendations = () => (
  <div className="profile-recommendations">
    <div className="profile-recommendations-list">
      {[1, 2, 3, 4, 5].map(value => <ProfileRecommendation {...{value}} />)}
    </div>
    <div className="Profile-recommendations-label text-left raleway">
      Bedste forslag til din profil
    </div>
  </div>
);

export default ProfileRecommendations;
