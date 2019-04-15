function randomPosition() {
  return {
    x: Math.floor(Math.random() * Math.floor(100)),
    y: Math.floor(Math.random() * Math.floor(100))
  };
}

export function percentageObjToPixel(e, pos = randomPosition()) {
  const x = (pos.x * (e.imgWidth || e.width)) / 100;
  const y = (pos.y * (e.imgHeight || e.height)) / 100;
  return {x, y};
}

export function pixelObjToPercentage(e, pos = randomPosition()) {
  const x = (pos.x / (e.imgWidth || e.width)) * 100;
  const y = (pos.y / (e.imgHeight || e.height)) * 100;
  return {x, y};
}
