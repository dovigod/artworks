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
    mult(val){
      this.x *= val;
      this.y *= val;
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
    constructor(x,y){
      this.pos = new Vector(x,y);
      this.vel = new Vector(0,-10);
      this.acc = new Vector(0,0);
      this.color = '#ffffff'
      ctx.lineWidth = 4;
    }

    addForce(force){
      this.acc.add(force)
    }
    update(){
      this.pos.add(this.vel)
      this.vel.add(this.acc)
      this.acc.mult(0);
    }
    render(){
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color
      ctx.beginPath(); // Start a new path
      ctx.arc(this.pos.x, this.pos.y, ctx.lineWidth / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath()
    }
  }


  const particles = [];

  function init(particleCnt){
    for(let i = 0 ; i < particleCnt ; i ++){
      particles.push(new Particle(Math.random()* dimension.width , dimension.height))
    }
  }
  init(1)

  function animate(){

    ctx.fillStyle = '#000000'
    ctx.clearRect(0,0,dimension.width, dimension.height)
    ctx.fillRect(0,0,dimension.width ,dimension.height)
    particles.forEach(particle => {
      particle.addForce(GRAVITY)
      particle.update()
      particle.render()
    })
    requestAnimationFrame(animate)
  }
  animate()

})()