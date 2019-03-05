export function percentageObjToPixel(e, pos) {
  const x = (pos.x * (e.imgWidth || e.width)) / 100;
  const y = (pos.y * (e.imgHeight || e.height)) / 100;
  return {x, y};
}

export function pixelObjToPercentage(e, pos) {
  const x = (pos.x / (e.imgWidth || e.width)) * 100;
  const y = (pos.y / (e.imgHeight || e.height)) * 100;
  return {x, y};
}
