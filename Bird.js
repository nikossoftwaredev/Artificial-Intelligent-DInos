class Bird{
  
constructor(speed,sprites){
  this.posX = width;
  this.posY = 0;
  this.posW = 45;
  this.posH = 45;

  
  this.fromGround = 20;  
  this.sprites = sprites;  
  this.speed = speed;
  
  this.animationTimer = 0;
  
  this.upOrDown = Math.floor(Math.random() * 2); //up 0 down 1
  
  this.updateY();
  
     
}


  updateY(){
    if(this.upOrDown == 0)
      this.posY = height  - 9 - ((this.posH + 5)*2);    //a little fixing to be understandable
    else
      this.posY = height - this.fromGround - (this.posH); 
    
  }
 
  
  
  show(){
    var a=0;
    this.animationTimer++;
    
    //rect(this.posX,this.posY,this.posW,this.posH);
    
    if(this.animationTimer <= 7)
      a=8;
    else if(this.animationTimer > 7 && this.animationTimer <= 14)
      a=9;
    else{
      a=8;
      this.animationTimer = 0;
    }
    
     image(sprites[a],this.posX,this.posY); 
  
  
  }
  
  
  move(){
    this.posX -= this.speed;
  
  }

}