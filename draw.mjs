// draw.mjs - Drawing functions
import { BLOCK_SIZE, WALL } from './constants.mjs'

const BLOCK_COLOUR = '#449944'// '#6633FF'
export const drawBlock = (ctx, x, y) => {
  ctx.fillStyle = BLOCK_COLOUR
  ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
}

const BACKGROUND_COLOUR = '#333'
export const drawBackground = (canvas) => {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = BACKGROUND_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const GRID_COLOUR = '#666'
const WALL_COLOUR = '#225522'
export const drawGrid = (canvas, grid) => {
  if (grid.length < 0) {
    return
  }
  const ctx = canvas.getContext('2d')
  const numYBlocks = grid.length
  const numXBlocks = grid[0].length
  const maxX = numXBlocks * BLOCK_SIZE
  const maxY = numYBlocks * BLOCK_SIZE

  // draw filled in blocks for walls
  ctx.fillStyle = WALL_COLOUR
  for (let y = 0; y < numYBlocks; y++) {
    for (let x = 0; x < numXBlocks; x++) {
      if (grid[y][x] === WALL) {
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      }
    }
  }

  // draw grid lines
  ctx.lineWidth = 2 // px
  ctx.strokeStyle = GRID_COLOUR;
  ctx.beginPath()
  for (let x = 0; x < (numXBlocks + 1) * BLOCK_SIZE; x += BLOCK_SIZE) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, maxY)
  }
  for (let y = 0; y < (numYBlocks + 1) * BLOCK_SIZE; y += BLOCK_SIZE) {
    ctx.moveTo(0, y)
    ctx.lineTo(maxX, y)
  }
  ctx.stroke()
}