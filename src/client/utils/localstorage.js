let supported;

try {
  supported = window && window.sessionStorage;
} catch (e) {
  // no need to handle the exception here.
}

export const setItem = (key, value, version) => {
  if (supported) {
    const entry = {
      // modified: (new Date()).getTime(),
      version,
      value
    };
    sessionStorage.setItem(key, JSON.stringify(entry));
  }
};

export const getItem = (key, version, defaultValue) => {
  if (!supported) {
    return defaultValue;
  }
  const jsonString = sessionStorage.getItem(key);
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
