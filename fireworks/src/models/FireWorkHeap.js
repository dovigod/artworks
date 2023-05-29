
export class FireWorkHeap{
  constructor(){
    this.storage = [];
    this.onStageNodeCnt = 0;
    this.removalStaged = 0;
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
    this.onStageNodeCnt ++;
    this._bubbleUp();
  }
  remove(){
    if(this.storage.length === 0) return;
    if(this.storage.length === 1 && !this.storage[0].root){
      this.storage.pop()
    }else{
      this.storage[0] = this.storage.pop();
      this._bubbleDown();
    }
    this.onStageNodeCnt --;
    this.removalStaged --;
  }
  removeStagedData(){
    this.storage = this.storage.slice(this.removalStaged);
    this._bubbleDown()

    // console.log('removed:: '+ this.removalStaged + 'items.')
    this.onStageNodeCnt -= this.removalStaged;
    this.removalStaged = 0;
  }
  onStageRemoval(){
    this._bubbleDown();
    this.removalStaged++;
  }
  
  _bubbleDown(){
    let idx = 0;
    const cnt = this.storage.length
    while(this._getLeftIdx(idx) < cnt){
        const leftIdx = this._getLeftIdx(idx);
        const rightIdx = this._getRightIdx(idx);
        const smallerChildNodeIdx = rightIdx < cnt && this.storage[rightIdx] < this.storage[leftIdx] ? rightIdx : leftIdx;
        
        if(this._compare(this.storage[idx].lifespan , this.storage[smallerChildNodeIdx].lifespan) >= 0){
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
      if(this._compare(this.storage[parentIdx].lifespan , this.storage[lastIdx].lifespan) >= 0){
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
