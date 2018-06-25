String.prototype.toColor = function(
  colors = ['#f37362', '#a8c7b0', '#74a9ff', '#edb347']
) {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = (hash % colors.length + colors.length) % colors.length;
  return colors[hash];
};
