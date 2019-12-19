var scrollTo = require('scroll-to');

/**

--- ease ---

  linear
  inQuad
  outQuad
  inOutQuad
  inCube
  outCube
  inOutCube
  inQuart
  outQuart
  inOutQuart
  inQuint
  outQuint
  inOutQuint
  inSine
  outSine
  inOutSine
  inExpo
  outExpo
  inOutExpo
  inCirc
  outCirc
  inOutCirc
  inBack
  outBack
  inOutBack
  inBounce
  outBounce
  inOutBounce
  inElastic
  outElastic
  inOutElastic

**/

export default function scroll(x = 0, y = 0, ease = 'outQuad', duration = 500) {
  scrollTo(x, y, {
    ease,
    duration
  });
}
