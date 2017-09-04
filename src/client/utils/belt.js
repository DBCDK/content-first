export const beltNameToPath = (name) => {
  return '/' + name.toLowerCase().replace(/ /g, '-');
};
