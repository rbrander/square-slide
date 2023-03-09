// touch.mjs -- Touch event handling

let startTouch = undefined
let swipeCallback = () => {}
let tapCallback = () => {}

const onTouchStart = (event) => {
  startTouch = event.changedTouches[0]
}

const onTouchEnd = (event) => {
  // calculate the direction of the swipe
  const endTouch = event.changedTouches[0]
  const diffX = endTouch.clientX - startTouch.clientX
  const diffY = endTouch.clientY - startTouch.clientY
  const isHorizontal = Math.abs(diffX) > Math.abs(diffY)
  let direction = '', magnitude = 0
  if (isHorizontal) {
    direction = (diffX < 0) ? 'left' : 'right'
    magnitude = Math.abs(diffX)
  } else {
    direction = (diffY < 0) ? 'up' : 'down'
    magnitude = Math.abs(diffY)
  }
  const isSwipe = magnitude > 10 // arbitrary number

  if (isSwipe) {
    swipeCallback(direction)
  } else {
    tapCallback(endTouch.clientX, endTouch.clientY)
  }
  // reset touch
  startTouch = undefined
}

export const setupTouchEventListeners = (target = document, onSwipe = (direction) => {}, onTap = (x, y) => {}) => {
  target.addEventListener('touchstart', onTouchStart)
  target.addEventListener('touchend', onTouchEnd)
  swipeCallback = onSwipe
  tapCallback = onTap
}
