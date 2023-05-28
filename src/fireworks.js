
class FireWorkHeap{
  constructor(){
    this.storage = [];
    this.onStageNodeCnt = 0;
  }

  peek(){
    if(this.storage.length === 0 ){
        return null;
    }else{
        return this.storage[0];
    }
}
  add(firework){
    this.storage.push(firework);
    this._bubbleUp();
  }
  remove(){
    if(this.storage.length === 1 && !this.storage[0].root){
      this.storage.pop()
    }else{
      this.storage[0] = this.storage.pop();
      this._bubbleDown();
    }
  }

  _bubbleDown(){
    let idx = 0;
    const cnt = this.storage.length
    while(this._getLeftIdx(idx) < cnt){
        const leftIdx = this._getLeftIdx(idx);
        const rightIdx = this._getRightIdx(idx);
        const smallerChildNodeIdx = rightIdx < cnt && this.storage[rightIdx] < this.storage[leftIdx] ? rightIdx : leftIdx;
        
        if(this._compare(this.storage[idx].root?.vel.y ?? 10 , this.storage[smallerChildNodeIdx].root?.vel.y ?? 10) <= 0){
            this._swap(idx, smallerChildNodeIdx);
            idx = smallerChildNodeIdx;
        }else{
            break;
        }
        
    }
  }
  _bubbleUp(){
    let lastIdx = this.storage.length - 1;
    while(lastIdx > 0){
      const parentIdx = parseInt((lastIdx - 1) / 2);
      if(this._compare(this.storage[parentIdx].root?.vel.y ?? 1 , this.storage[lastIdx].root?.vel.y ?? 1) <= 0){
          this._swap(parentIdx , lastIdx);
          lastIdx = parentIdx;
      }
      else{
          break;
      } 
    }
  }
  _getLeftIdx = (idx) =>  idx*2 + 1;
  _getRightIdx = (idx) => idx*2 + 2;
  _swap = (a, b) => {
    [this.storage[a],this.storage[b]] = [this.storage[b],this.storage[a]];
  }
  _compare = (a, b) => a-b;
}


(function(){

  //basic settings
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const dimension = {
    width : canvas.width,
    height: canvas.height
  }
  ctx.fillStyle = '#000000'
  ctx.fillRect(0,0, dimension.width, dimension.height)

  class Vector{
    constructor(x,y){
      this.x = x;
      this.y = y;
    }

    add(dv){
      this.x += dv.x;
      this.y += dv.y;
    }
    mult(val = 1, threshold){
      if(val && threshold){
        this.x *= (Math.random()*threshold) + val
        this.y *= (Math.random()*threshold) + val
      }else{
        this.x *= val;
        this.y *= val;
      }      
    }
    static multiply(baseVector, val){
      return new Vector(baseVector.x * val , baseVector.y * val);
    }
    static random(){
      const x = ((Math.random() - 0.5) * 24)
      const y =  -((Math.random()* 10))  ;
      return new Vector(x,y);
    }
    objectify(){
      return {
        x : this.x,
        y : this.y
      }
    }
  }

  const GRAVITY = new Vector(0, 0.2)
  class Particle{
    constructor(x,y, isRoot = true){
      this.pos = new Vector(x,y);
      if(isRoot){
        this.vel = new Vector(0,-(Math.random()*4) - 8);
      }else{
        this.vel = Vector.random();
        this.vel.mult(0.2, 0.5)
      }
      this.acc = new Vector(0,0);
      this.color = '#ffffff'
      this.size = 4;
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
      ctx.lineWidth = this.size
      if(this.size < 0){
        return;
      }
      ctx.fillStyle = this.color
      ctx.beginPath(); // Start a new path
      ctx.arc(this.pos.x, this.pos.y, ctx.lineWidth / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath()
    }
  }

  class Firework{
    constructor(){
      this.root = new Particle(Math.random()* dimension.width , dimension.height);
      this.particles = [];
      this.explode = false;
      this.finish = false;
      this.lifespan = 4;
    }
    update(){
      if(this.finish){
        return;
      }
      if(this.explode){
        this.lifespan -= 0.03

        for(let i = 0 ; i < this.particles.length ; i ++){
          const force = Vector.multiply(GRAVITY , 0.3)
          this.particles[i].addForce(force)
          this.particles[i].update(this.lifespan);
        }
        if(this.lifespan <= 0){
          this.finish = true;
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

      this.root.addForce(GRAVITY);
      this.root.update()
    }
    blast(){
      for(let i = 0 ; i < 100 ; i ++){
        this.particles.push(new Particle(this.root.pos.x , this.root.pos.y, false));
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


  const fireworks = new FireWorkHeap();
  // function init(particleCnt){
  //   for(let i = 0 ; i < particleCnt ; i ++){
  //     fireworks.push(new Firework())
  //   }
  // }
  // init(1)
  // let cnt = 0;

  function animate(){

    ctx.fillStyle = '#000000'
    ctx.clearRect(0,0,dimension.width, dimension.height)
    ctx.fillRect(0,0,dimension.width ,dimension.height)
    if(Math.random() < 0.03){
      fireworks.add(new Firework())
    }
    for(let i= 0 ; i < fireworks.storage.length;  i++){
      // && cnt < 1000
      if(fireworks.peek() && fireworks.peek()?.finish ){
        // console.log(fireworks.storage.length)
        fireworks.remove()
        
        // cnt ++;
        // console.log(heap)
      }
      // if(heap.storage[i].root){
        fireworks.storage[i]?.update();
        fireworks.storage[i]?.render()
      // }
    }
    // if(aa && !heap.storage[3]?.root){
    //   aa = false;
    //   // console.log(heap)
    // }


    requestAnimationFrame(animate)
  }
  animate()

})()