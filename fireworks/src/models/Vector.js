export  class Vector{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  add(dv){
    this.x += dv.x;
    this.y += dv.y;
  }
  mult(val = 1){
    if(typeof val === 'object'){
      const {x,y} = val;
      this.x *= x
      this.y *= y
    }else{
      this.x *= val;
      this.y *= val;
    }      
  }
  objectify(){
    return {
      x : this.x,
      y : this.y
    }
  }
  static multiply(baseVector, val){
    return new Vector(baseVector.x * val , baseVector.y * val);
  }
  static random(bandWidthX = 0.5 , strengthX = 1 , bandWidthY = 0.5, strengthY = 1){
    const x = ((Math.random() - bandWidthX) * strengthX)
    const y =  (((Math.random() - bandWidthY)* strengthY));
    return new Vector(x,y);
  }
  
}