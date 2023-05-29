import { Particle } from './Particle.js'
import {Vector} from './Vector.js'

const colorPalete = ['#7033FE' , '#02b7fd', '#e80b0d' , '#ffa30c' , '#feff0c' , '#0FFAA1' , '#F4F4F4' , '#F48FF2'];

export class Firework{
  constructor(ctx,storage , field , baseDeaccelerator){
    this.ctx = ctx
    this.field = field;
    this.color = colorPalete[Math.floor(Math.random() * colorPalete.length)]
    this.root = new Particle(this.ctx, Math.random()* this.field.width , this.field.height , true, this.color);
    this.isRare = Math.random() < 0.1;
    this.particles = [];
    this.explode = false;
    this.finish = false;
    this.lifespan = 4;
    this.store = storage;
    this.baseDeaccelerator = baseDeaccelerator;

    
  }
  update(){
    if(this.finish){
      return;
    }
    if(this.explode){
      this.lifespan -= 0.03

      for(let i = 0 ; i < this.particles.length ; i ++){
        const force = Vector.multiply(this.baseDeaccelerator , 0.3)
        this.particles[i].addForce(force)
        this.particles[i].update(this.lifespan);
      }
      if(this.lifespan <= 0){
        this.finish = true;
        this.store.onStageRemoval()
        return;
      }
    }
    if(!this.root){
      return;
    }
    if(this.root.vel.y >= 0){
      this.explode = true;
      this.blast();
      this.root = null;
      return;
    }

    this.root.addForce(this.baseDeaccelerator);
    this.root.update()
  }
  blast(){
    for(let i = 0 ; i < 100 ; i ++){
      this.particles.push(new Particle(this.ctx, this.root.pos.x , this.root.pos.y, false , this.isRare ?  colorPalete[Math.floor(Math.random() * colorPalete.length)] : this.color ));
    }
  }
  render(){
    if(!this.explode){
      this.root?.render();
    }else{
      for(let i = 0 ; i < this.particles.length ; i ++){
        this.particles[i].render();
      }
    }
  }
}
