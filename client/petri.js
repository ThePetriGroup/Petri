var canvas;
var context;
var count = 50;
var mouseX = 0;
var mouseY = 0;
var gotoX = 0;
var gotoY = 0;
var playerX = 100;
var playerY = 100;
$(document).ready(function(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
//  var background = new Image();
//  background.src = "background.svg";

//  context.drawImage(background,0,0);
    draw();
});
window.addEventListener("mousemove", function(){
    mouseX = event.clientX; 
    mouseY = event.clientY; 
});

function calcLocation(){
    
    
    
};

function draw() {
    requestAnimationFrame(draw);
    context.fillStyle="white";
    context.fillRect(0,0,window.innerWidth,window.innerHeight);
    var x = mouseX-playerX;
    var y = mouseY-playerY;
    x>0?gotoX=4:gotoX=-4;
    y>0?gotoY=4:gotoY=-4;
    playerX = playerX+gotoX;
    playerY = playerY+gotoY;
    context.fillStyle="blue";
    context.beginPath();
    context.arc(playerX,playerY,50,0,2*Math.PI);
    context.fill();
    context.stroke();
}
