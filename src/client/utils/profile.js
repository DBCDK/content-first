import unique from './unique';

export function saveProfiles(profiles, currentTaste) {
  if (window && window.localStorage) {
    localStorage.setItem(
      'contentFirstProfile',
      JSON.stringify({profiles, currentTaste})
    );
  }
}

export function getProfiles(cb) {
  setTimeout(() => {
    if (window && window.localStorage) {
      return cb(JSON.parse(localStorage.getItem('contentFirstProfile')));
    }
    return cb();
  }, 500);
}

export function getAllSelectedTags(profile) {
  return unique([...profile.moods, ...profile.authors, ...profile.genres]);
}

export function addElementsToProfiles({profiles, currentTaste}, obj) {
  const profile = Object.keys(obj).reduce((currentProfile, beltName) => {
    currentProfile[beltName] = unique([
      ...currentProfile[beltName],
      ...obj[beltName]
    ]);
    if (beltName !== 'archetypes') {
      currentProfile.allSelectedTags = unique([
        ...currentProfile.allSelectedTags,
        ...obj[beltName]
      ]);
    }
    return currentProfile;
  }, profiles[currentTaste]);
  const updatedProfiles = Object.assign({}, profiles, {
    [currentTaste]: profile
  });
  return {profiles: updatedProfiles, profile};
}

export function removeElementFromProfiles(
  {profiles, currentTaste},
  beltname,
  value
) {
  const profile = profiles[currentTaste];
  profile[beltname] = profile[beltname].filter(element => element !== value);
  profile.allSelectedTags = profile.allSelectedTags.filter(
    element => element !== value
  );
  const updatedProfiles = Object.assign({}, profiles, {
    [currentTaste]: profile
  });
  return {profiles: updatedProfiles, profile};
}
