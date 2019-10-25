let supported;

try {
  supported = window && window.sessionStorage && window.localStorage;
} catch (e) {
  // no need to handle the exception here.
}

export const setItem = (key, value, version, type = 'sessionstorage') => {
  if (supported) {
    const entry = {
      // modified: (new Date()).getTime(),
      version,
      value
    };
    if (type === 'sessionstorage') {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } else if (type === 'localstorage') {
      localStorage.setItem(key, JSON.stringify(entry));
    }
  }
};

export const getItem = (
  key,
  version,
  defaultValue,
  type = 'sessionstorage'
) => {
  if (!supported) {
    return defaultValue;
  }
  let jsonString;
  if (type === 'sessionstorage') {
    jsonString = sessionStorage.getItem(key);
  } else if (type === 'localstorage') {
    jsonString = localStorage.getItem(key);
  }
  if (!jsonString) {
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(jsonString);
    if (version !== parsed.version) {
      return defaultValue;
    }
    if (!parsed.value) {
      return defaultValue;
    }
    return parsed.value;
  } catch (e) {
    console.log(`Could not parse sessionStorage item with key=${key}`); // eslint-disable-line
    return defaultValue;
  }
};
