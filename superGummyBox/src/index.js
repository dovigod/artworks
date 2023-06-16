import { hypotenuse, distance } from './utils/math.js';
import {Box} from './models/Box.js'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pixelRatio = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2
const bgColor = '#000000'
const mainColor = 'skyblue'
//adjust resolution , dimension
canvas.width = innerWidth * pixelRatio
canvas.height = innerHeight * pixelRatio

// initializing.
const fps = 60
const interval = 1000 / fps
let now
let then = Date.now()
let delta
const BOX_SIZE = hypotenuse(canvas.width, canvas.height) * 0.3;
const box = new Box(ctx,
  canvas.width / 2 - BOX_SIZE / 2,
  canvas.height / 2 - BOX_SIZE / 2,
  BOX_SIZE,
  BOX_SIZE,
  mainColor
)
window.mouse = {
  isDown: false,
  x: canvas.width / 2,
  y: canvas.height / 2,
  ox: canvas.width / 2,
  oy: canvas.height / 2,
  mx: canvas.width / 2,
  my: canvas.height / 2
}



function render() {
  requestAnimationFrame(render)

  now = Date.now()
  delta = now - then
  if (delta < interval) return

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  box.animate()

  then = now - (delta % interval)
}

function onPointerDown(e) {
  if (!box.checkInsideBox(e.clientX * pixelRatio, e.clientY * pixelRatio)) return
  if (mouse.isDown) return
  mouse.isDown = true
  mouse.x = e.clientX * pixelRatio
  mouse.y = e.clientY * pixelRatio
  mouse.ox = e.clientX * pixelRatio
  mouse.oy = e.clientY * pixelRatio
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e) {
  mouse.x = e.clientX * pixelRatio
  mouse.y = e.clientY * pixelRatio
  mouse.mx = canvas.width / 2 + mouse.x - mouse.ox
  mouse.my = canvas.height / 2 + mouse.y - mouse.oy
  if (distance(mouse.x, mouse.y, canvas.width / 2, canvas.height / 2) > Math.pow(BOX_SIZE * 1.3,2)) {
    onPointerUp()
  }
}

function onPointerUp() {
  backAnimation()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function backAnimation() {
  gsap.to(mouse, {
    mx: canvas.width / 2,
    my: canvas.height / 2,
    duration: 0.4,
    ease: Elastic.easeOut.config(1, 0.1),
    onComplete: () => mouse.isDown = false
  })
}

window.addEventListener('pointerdown', onPointerDown)
window.addEventListener('DOMContentLoaded', () => {
  render()
})
