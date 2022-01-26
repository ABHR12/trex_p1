
var trex;// variable del Sprite
var trex_running;// variable para cargar imagenes 
var trex_collide;
var ground,groundImage, invisibleGround; 
var o1,o2,o3,o4,o5,o6;
var cloud;
var END=0;//constante,no cmabia su valor
var PLAY=1;
var gameState=PLAY;//el guego inicia desde que carga 
var obstaculesGroup;//grups
var cloudGroup;//grups
var gameover,gameoverIMG;
var restar,restarIMG;
var score=0;//marcador
var saltar ;
var subir_nivel;
var muerte;
var touches=[];//arreglo vacio

function preload(){ // cargar imagenes, sonido y animaciones 
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png"); //carga a memoria 
  trex_collide=loadAnimation("trex_collided.png");
  saltar=loadSound("jump.mp3");//sonido
  subir_nivel=loadSound("checkPoint.mp3");//sonido
  muerte=loadSound("die.mp3");//sonido 

  groundImage=loadImage("ground2.png");
  o1=loadImage("obstacle1.png");
  o2=loadImage("obstacle2.png");
  o3=loadImage("obstacle3.png");
  o4=loadImage("obstacle4.png");
  o5=loadImage("obstacle5.png");
  o6=loadImage("obstacle6.png");
  cloudimg=loadImage("cloud.png");
  gameoverIMG=loadImage("gameOver.png");
  restarIMG=loadImage("restart.png");
} 

function setup(){ // configuración 
  createCanvas(windowWidth,windowHeight) // Se crea el lienzo o espacio de trabajo 
  //windowWidth(para x) y windowHeight(para y) para acodar a diferentes pantallas 
 invisibleGround=createSprite(200,height-92,400,10);
  invisibleGround.visible=false;

 ground=createSprite(200,height-100,400,20); 
  ground.addAnimation("piso",groundImage); 

  trex=createSprite(30,ground.y,15,15); //se crea el personaje principal
  trex.addAnimation("trex_corre",trex_running); //se "pega la animación" 
  trex.addAnimation("trex_morido",trex_collide);
  trex.scale=0.5; // se cambia el tamaño 
  trex.debug=true //activar el sensor de colicion 
  trex.setCollider("rectangle",0,0,80,80)//sensores de colicion

 
  gameover=createSprite(width/2,height/2);
  gameover.addImage(gameoverIMG);
  gameover.scale=0.5;
  gameover.visible=false; //invisibles

  restar=createSprite(width/2,gameover.y +29,50,50);
  restar.addImage(restarIMG);
  restar.scale=0.5;
  restar.visible=false; //invisibles 

  

  obstaculesGroup=new Group();//grupos de objetos
  cloudGroup=new Group();//grupos de nuebes 
}

function draw(){ // DIBUJAR cuadro por cuadro de animación 

  background("black") //Color del lienzo 
  fill("white");//color de texto 
  text("score: "+score,width-100,50);//marcador
  
 
  drawSprites(); // dibuja los sprites 

//getFrameRate cuadros por segundo 

  if(gameState===PLAY){
    ground.velocityX=-(10+3*getFrameRate()/200);  //velocidad del suelo
    score=score+Math.round(getFrameRate()/60);//marcador de distancia
    if(keyDown("space")&&trex.y>=50||touches.length>0){
    
    trex.velocityY=-15;
    saltar.play();
    touches=[]//vacion nievamente la matriz de touches  
  }  
  if(frameCount%100==0){ //PUNTIACION CON SONIDO 
      subir_nivel.play();
  }
  pintarnubes();
  obstaculos();
  if(ground.x<0){
   ground.x=ground.width/2;//piso infinito 
  }
  if (obstaculesGroup.isTouching(trex)){//colicion de objetos 
    //saltar.play();//IA
    //trex.velocityY=-15;//IA
    gameState=END
   muerte.play();
  }
  
  }else if(gameState===END){
    ground.velocityX=0;
   obstaculesGroup.setVelocityXEach(0);//detener los obstaculos
   cloudGroup.setVelocityXEach(0);// detener las nubes 
   obstaculesGroup.setLifetimeEach(-1);//nunca llegar a 0 para no desaparecer los objetos al perder el juego 
   cloudGroup.setLifetimeEach(-1);//
   trex.changeAnimation("trex_morido",trex_collide);//cambio de animacion 
   gameover.visible=true;//hacer visible
   restar.visible=true; //hacer visible
   
   if (mousePressedOver(restar)){
     reiniciar();
   }
  }

 

  trex.velocityY=trex.velocityY+1;// gravedad 
  //console.log(trex.y);
  trex.collide(invisibleGround); // el trex choca contra el piso

}
 



function pintarnubes(){
  var distancia=Math.round(random(20,height/2));//numeros aleatorios 
  if(frameCount%80===0){
    //console.log(frameCount);
    cloud=createSprite(width,distancia,30,10);
    cloud.velocityX=-2;//velocidad nube
    cloud.addImage("nuve",cloudimg);//pegar imagen
    cloud.lifetime=800;//timpo de vida de cada nube
    trex.depth=cloud.depth+1;//profundidad
    //console.log("trex="+trex.depth);//profundidad trex
    //console.log("cloud="+cloud.depth);//profundid ad nube
    cloudGroup.add(cloud);//se agrega cada muve al grupo
  }
}

function obstaculos(){
  if (frameCount%80===0){
    ob=createSprite(width,ground.y-10,10,40);
    ob.velocityX=-(5+3*getFrameRate()/200);//aumentar velocidad cada tantos cuadros 
    var numcactus=Math.round(random(1,6));
    switch(numcactus){//alotoriedad en captus 
      case 1: 
        ob.addImage(o1);
        ob.scale=0.8
        break;
      case 2:
        ob.addImage(o2);
        ob.scale=0.6
        break;
      case 3:
        ob.addImage(o3);
        ob.scale=0.5
        break;
      case 4:
        ob.addImage(o4);
        ob.scale=0.6
        break;
      case 5:
        ob.addImage(o5);
        ob.scale=0.7
        break;
      case 6:
        ob.addImage(o6);
        ob.scale=0.7
        break;
    }
    ob.lifetime=500;
    obstaculesGroup.add(ob);
  }
}


function reiniciar(){
  trex.changeAnimation("trex_corre",trex_running);
  obstaculesGroup.destroyEach();
  cloudGroup.destroyEach();
  gameState=PLAY; 
  score=0;
  gameover.visible=false;
  restar.visible=false;
}
