// constants.mjs -- Global constants

export const WALL = 1
export const BLOCK_SIZE = 100 // pixels
export const BLOCK_ANIMATION_DURATION = 250 // ms

// KeyboardEvent.key values used in this application
// Source: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export const KEYS = {
  W:'w',
  A:'a',
  S:'s',
  D:'d',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  SPACE: ' '
}

export const DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down'
}

export const DIRECTION_KEYS = {
  [DIRECTIONS.RIGHT]: [KEYS.ARROW_RIGHT, KEYS.D],
  [DIRECTIONS.LEFT]: [KEYS.ARROW_LEFT, KEYS.A],
  [DIRECTIONS.UP]: [KEYS.ARROW_UP, KEYS.W],
  [DIRECTIONS.DOWN]: [KEYS.ARROW_DOWN, KEYS.S]
}

