// app.mjs - Application Entry Point
import {
  KEYS,
  WALL,
  DIRECTIONS,
  DIRECTION_KEYS,
  BLOCK_SIZE,
  BLOCK_ANIMATION_DURATION
} from './constants.mjs'
import {
  setupKeyboardEventListeners,
  clearKeys,
  isKeyDown
} from './keyboard.mjs'
import { setupTouchEventListeners } from "./touch.mjs"
import {
  drawBackground,
  drawBlock,
  drawGrid
} from './draw.mjs'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const bouncySound = new Audio()
bouncySound.src = './bouncy-sound.mp3'

//////////////////////////////////

// Given a progress, x (0..1), return the relative position (0..1)
// Source: https://easings.net/#easeInOutQuint
// const easeInOutQuint = (x) => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2)

// Source: https://easings.net/#easeOutElastic
const easeOutElastic = (x) => x === 1 ? 1 : (Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1)

let numMoves = 0
let blockX = 0, blockY = 0
let blockAnimation = undefined
const Game = {}

const makeWall = () => {
  Game.MAP[~~(blockY / BLOCK_SIZE)][~~(blockX / BLOCK_SIZE)] = WALL;
}

const movementQueue = new Set()
const moveBlock = (direction, tick) => {
  const isBlockMoving = blockAnimation !== undefined
  if (isBlockMoving) {
    // add request to the queue, if direction is different
    if (blockAnimation.direction !== direction) {
      movementQueue.add(direction)
    }
    return
  }

  numMoves++
  bouncySound.play()

  const currBlockMapX = Math.floor(blockX / BLOCK_SIZE)
  const currBlockMapY = Math.floor(blockY / BLOCK_SIZE)
  let start, distance
  switch (direction) {
    case DIRECTIONS.DOWN: {
      let blockYEnd = (Game.MAX_Y_BLOCKS - 1) * BLOCK_SIZE
      for (let y = currBlockMapY + 1; y < Game.MAX_Y_BLOCKS; y++) {
        if (Game.MAP[y][currBlockMapX] !== 0) {
          blockYEnd = (y - 1) * BLOCK_SIZE
          break;
        }
      }

      start = blockY
      distance = blockYEnd - blockY
      break
    }
    case DIRECTIONS.RIGHT: {
      // find the max distance we can travel by iterating through the map to check for walls
      let blockXEnd = (Game.MAX_X_BLOCKS - 1) * BLOCK_SIZE
      for (let x = currBlockMapX + 1; x < Game.MAX_X_BLOCKS; x++) {
        if (Game.MAP[currBlockMapY][x] !== 0) {
          blockXEnd = (x - 1) * BLOCK_SIZE
          break;
        }
      }

      start = blockX
      distance = blockXEnd - blockX
      break
    }
    case DIRECTIONS.LEFT: {
      // find the max distance we can travel by iterating through the map to check for walls
      let blockXEnd = 0
      for (let x = currBlockMapX - 1; x >= 0; x--) {
        if (Game.MAP[currBlockMapY][x] !== 0) {
          blockXEnd = (x + 1) * BLOCK_SIZE
          break;
        }
      }

      start = blockX
      distance = blockXEnd - blockX
      break
    }
    case DIRECTIONS.UP: {
      // find the max distance we can travel by iterating through the map to check for walls
      let blockYEnd = 0
      for (let y = currBlockMapY - 1; y >= 0; y--) {
        if (Game.MAP[y][currBlockMapX] !== 0) {
          blockYEnd = (y + 1) * BLOCK_SIZE
          break;
        }
      }

      start = blockY
      distance = blockYEnd - blockY
      break
    }
    default:
      break
  }
  // Trigger animation by assigning a value to blockAnimation
  blockAnimation = { startTick: tick, startPosition: start, distance, direction }
}

const updateBlock = (tick) => {
  const isBlockMoving = (blockAnimation !== undefined)
  if (isBlockMoving) {
    // calculate progress (0 .. 1.0 == 100%)
    const progress = Math.min((tick - blockAnimation.startTick) / BLOCK_ANIMATION_DURATION, 1.0)

    // Update the block position
    const position = blockAnimation.startPosition + (easeOutElastic(progress) * blockAnimation.distance)
    const isMovingHorizontal = (blockAnimation.direction === DIRECTIONS.RIGHT || blockAnimation.direction === DIRECTIONS.LEFT)
    if (isMovingHorizontal) {
      blockX = position
    } else {
      blockY = position
    }

    // check if animation is done
    const isDone = progress >= 1.0
    if (isDone) {
      blockAnimation = undefined
    }
  } else {
    // Check the movement queue for any directions to process
    const nextDirection = movementQueue.values().next()
    if (nextDirection.done === false) {
      moveBlock(nextDirection.value, tick)
      movementQueue.delete(nextDirection.value)
    }

    if (isKeyDown(KEYS.SPACE)) {
      makeWall()
    }
  }

  // iterate over the direction keys to see if any are pressed
  Object.keys(DIRECTION_KEYS).forEach((direction) => {
    const keys = DIRECTION_KEYS[direction]
    const areAnyKeysDown = keys.some(isKeyDown)
    if (areAnyKeysDown) {
      movementQueue.add(direction)
      clearKeys(keys)
    }
  })
}

const onSwipe = (direction) => {
  const isBlockMoving = (blockAnimation !== undefined)
  if (isBlockMoving) {
    return
  }
  movementQueue.add(direction)
}

const onTap = (x, y) => {
  makeWall()
}

//////////////////////////

const update = (tick) => {
  updateBlock(tick)
}

const draw = (tick) => {
  drawBackground(canvas)
  // offset the drawing by half a pixel for crisper lines
  ctx.translate(0.5, 0.5)
  drawGrid(canvas, Game.MAP)
  drawBlock(ctx, blockX, blockY)


  ctx.font = '40px Arial'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'
  ctx.fillText(`Moves: ${numMoves}`, 10, 10)
//ctx.fillText([...movementQueue].toString(), 10, 10)

  ctx.translate(-0.5, -0.5)
}

const loop = (tick) => {
  update(tick)
  draw(tick)
  requestAnimationFrame(loop)
}

const resize = (event = { target: window }) => {
  canvas.width = ~~(event.target.innerWidth / BLOCK_SIZE) * BLOCK_SIZE + 1
  canvas.height = ~~(event.target.innerHeight / BLOCK_SIZE) * BLOCK_SIZE + 1
}

// init //////////////////////////

console.log('Square Slide')

setupKeyboardEventListeners(window)
setupTouchEventListeners(canvas, onSwipe, onTap)

// determine the max size grid can fit on screen
window.addEventListener('resize', resize)
resize()
Game.MAX_X_BLOCKS = Math.floor(canvas.width / BLOCK_SIZE)
Game.MAX_Y_BLOCKS = Math.floor(canvas.height / BLOCK_SIZE)
Game.MAP = new Array(Game.MAX_Y_BLOCKS).fill().map(() => new Array(Game.MAX_X_BLOCKS).fill(0))
Game.MAP[0][0] = 1
console.log(`Blocks: ${Game.MAX_X_BLOCKS}x${Game.MAX_Y_BLOCKS}`)

requestAnimationFrame(loop)
