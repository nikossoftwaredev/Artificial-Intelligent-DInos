class Road{
  
  constructor(speed,sprites){
    this.fromGround = 30;
    this.sprites = sprites;
    this.speed = speed;
    this.posX = width;
    //this.posH = Math.floor(random()*25);
    this.posY = height - this.fromGround;
    this.posW = 1201;
    
  
    
    
  }
  
  
  updateY(){
    this.posY = height - this.fromGround;
    
  }
  
  
  show(){
    
    
    
    image(sprites[10],this.posX,this.posY); 
    //line(this.posX,this.posY,this.posX + this.posW,this.posY);
    
  }
  
  
  move(){

    this.posX -= this.speed;
 
    
  }
  
  
  
}