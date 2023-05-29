import {Vector} from './Vector.js';
export class Particle{
  constructor(ctx, x,y, isRoot = true , color , size = 4){
    this.pos = new Vector(x,y);
    this.color = color;
    if(isRoot){
      this.vel = new Vector(0,-(Math.random()*4) - 8);
    }else{
      this.vel = Vector.random(0.5 ,Math.random()*20 + 4 , 0 , -Math.random()*10 - 3);
      this.vel.mult({
        x: 0.3,
        y: 0.5
      })
      // {
      //   x: 0.5,
      //   y: 0.5
      // }
    }
    this.acc = new Vector(0,0);
    this.size = size;
    this.ctx = ctx;
  }

  addForce(force){
    this.acc.add(force)
  }
  update(lifespan){
    this.pos.add(this.vel)
    this.vel.add(this.acc)
    this.acc.mult(0);
    if(lifespan){
      this.size = lifespan
    }
  }
  render(){
    this.ctx.lineWidth = this.size
    if(this.size < 0){
      return;
    }
    this.ctx.fillStyle = this.color
    this.ctx.beginPath(); // Start a new path
    this.ctx.arc(this.pos.x, this.pos.y, this.ctx.lineWidth / 2, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath()
  }
}