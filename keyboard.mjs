// keyboard.mjs - Keyboard Event handling
const KEYS_DOWN = new Set()

const onKeyUp = ({ key }) => {
  KEYS_DOWN.delete(key)
}

const onKeyDown = ({ key }) => {
  KEYS_DOWN.add(key)
}

export const setupKeyboardEventListeners = (target = document) => {
  target.addEventListener('keyup', onKeyUp)
  target.addEventListener('keydown', onKeyDown)
}

export const clearKeys = (keys) => {
  keys.forEach(key => { KEYS_DOWN.delete(key) })
}

export const isKeyDown = (key) => KEYS_DOWN.has(key)
