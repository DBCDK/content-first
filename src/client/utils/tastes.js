import unique from './unique';

export function saveTastes(profiles, currentTaste) {
  if (window && window.localStorage) {
    localStorage.setItem(
      'contentFirstProfile',
      JSON.stringify({profiles, currentTaste})
    );
  }
}

export function getTastes(cb) {
  setTimeout(() => {
    if (window && window.localStorage) {
      return cb(JSON.parse(localStorage.getItem('contentFirstProfile')));
    }
    return cb();
  }, 500);
}

export function addElementsToTastes({profiles, currentTaste}, obj) {
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

export function removeElementFromTastes(
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
