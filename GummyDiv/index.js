const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pixelRatio = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2
const bgColor = '#000000'
const fps = 60
const interval = 1000 / fps
//adjust resolution , dimension
canvas.width = innerWidth * pixelRatio;
canvas.height = innerHeight * pixelRatio;

ctx.scale(pixelRatio,pixelRatio);
let currentFrame = 0;
let pointer = {
  x: null,
  y: null,
  dx: null,
  dy: null,
  active: false
}


window.addEventListener('mousedown', (event) => {
  pointer.active = true
  pointer.x = event.x
  pointer.y = event.y;
})
window.addEventListener('mousemove', (event) => {

  if(!pointer.active) return;
  if(pointer.x === null){
    pointer.dx = 0;
    pointer.dy = 0;
  }else{
    pointer.dx = event.x - pointer.x;
    pointer.dy = event.y - pointer.y;
  }
  pointer.x = event.x;
  pointer.y = event.y;


})
window.addEventListener('mouseup', (event) => {
  pointer.active = false
})


function radToDeg(rad){
  return rad* (180 / Math.PI)
}
function dotProduct(uvecX , uvecY){
  return (uvecX.x * uvecY.x) + (uvecX.y *uvecY.y)
}
function getOrthVecDirection(uvecX, uvecY){
  const dirZ = (uvecX.x * uvecY.y) - (uvecX.y * uvecY.x);
  return dirZ;
}

function getDistance(vectorX, vectorY){
  return (vectorX.x - vectorY.x) ** 2 + (vectorX.y - vectorY.y) ** 2
}

function getIntersectingAngle(uvecX , uvecY){
  const cosinus = dotProduct(uvecX,uvecY);
  const direction = getOrthVecDirection(uvecX, uvecY) ;
  return direction > 0? Math.acos(cosinus) : (2*Math.PI) - Math.acos(cosinus)
}

function normalize(vector){
  const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude
  }
}


class Grid{
  constructor(ctx, vpw , vph, distance, color ='#ff0000'){
    this.ctx = ctx;
    this.vpw = vpw;
    this.vph = vph;
    this.distance = distance;
    this.facingAngle = 0;
    this.cols = new Array(Math.ceil(this.vpw / this.distance)).fill(0).map((_,i) => i);
    this.rows = new Array(Math.ceil(this.vph / this.distance)).fill(0).map((_,i) => i);
    this.color = color;
  }

  render(){
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();

    this.cols.forEach((col) => {
      this.ctx.moveTo(col * this.distance,0);
      this.ctx.lineTo(col * this.distance, this.vph);
    })
    this.rows.forEach((row) => {
      this.ctx.moveTo(0, row * this.distance);
      this.ctx.lineTo(this.vpw, row * this.distance);
    })
    this.ctx.closePath()

    this.ctx.stroke()
  }
}
class Gum{
  constructor(ctx , basePosition, radius, color){
    this.radius = radius;
    this.basePosition = basePosition;
    this.ctx = ctx;
    this.color = color;
    this.originVector = {
      x : -1,
      y : 0
    }
    this.direction = {
      x: 0,
      y: 0
    }
  }
  isPointerInBoundingBox(pointer){
    return this.radius ** 2 > getDistance(pointer,this.basePosition)
  }

  update(){
    if(pointer.active && pointer.x){
      this.direction.x = pointer.x - this.basePosition.x,
      this.direction.y = pointer.y - this.basePosition.y
      this.direction = normalize(this.direction);
      this.facingAngle = getIntersectingAngle(this.originVector, this.direction);
    }
  }
  render(){
    this.ctx.beginPath()
    this.ctx.arc(this.basePosition.x , this.basePosition.y , this.radius ,-Math.PI / 2 + this.facingAngle,  Math.PI - Math.PI / 2 + this.facingAngle) ;
    this.ctx.closePath()
    this.ctx.fillStyle = this.color;
    this.ctx.fill()
  }
}

const g = new Gum(
  ctx,
  {
  x: 300,
  y: 300
}, 100, '#F94892')
const grid = new Grid(ctx, innerWidth, innerHeight, 50)
grid.render()
function render(){
  
  if(currentFrame > interval){
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    g.render()
    grid.render()

    g.update()
  }
  currentFrame++;
  requestAnimationFrame(render)
}
render()