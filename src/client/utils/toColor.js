/* eslint-disable operator-assignment */
export default function toColor(
  id,
  colors = ['#f37362', '#a8c7b0', '#74a9ff', '#edb347']
) {
  let hash = 0;
  if (id.length === 0) {
    return hash;
  }
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
}
/* eslint-enable operator-assignment */
