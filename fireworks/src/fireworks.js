import {FireWorkHeap} from './models/FireWorkHeap.js'
import {Vector} from './models/Vector.js'
import {Particle} from './models/Particle.js'
import { Firework } from './models/Firework.js'

self.onmessage = function(ev){
  if(ev.data.msg === 'offscreen') {
    let canvas = ev.data.canvas;
    const ctx = canvas.getContext('2d');
    const dimension = {
      width : canvas.width,
      height: canvas.height
    }
    ctx.fillStyle = '#000000'
    ctx.fillRect(0,0, dimension.width, dimension.height)

    const GRAVITY = new Vector(0, 0.2)
    const fireworks = new FireWorkHeap();
    function animate(){

      // ctx.clearRect(0,0,dimension.width, dimension.height)
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fillRect(0,0,dimension.width ,dimension.height)
      if(Math.random() < 0.03){
        fireworks.add(new Firework(ctx, fireworks , dimension, GRAVITY))
        // console.log('new object added, '  +fireworks.onStageNodeCnt + ' items on stage')
      }
      if(fireworks.removalStaged > 0 && fireworks.peek() && fireworks.peek()?.finish){
        fireworks.remove();
        // console.log(fireworks.storage, fireworks.storage.length  )
      }
      for(let i= 0 ; i < fireworks.storage.length;  i++){
          fireworks.storage[i]?.update();
          fireworks.storage[i]?.render()
      }

      requestAnimationFrame(animate)
    }
    animate()
  }
}