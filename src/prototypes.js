/* eslint-disable no-extend-native, operator-assignment */

String.prototype.toColor = function(
  colors = ['#f37362', '#a8c7b0', '#74a9ff', '#edb347']
) {
  let hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (let i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = (hash % colors.length + colors.length) % colors.length;
  return colors[hash];
};
/* eslint-enable no-extend-native, operator-assignment */
