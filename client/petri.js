var canvas;
var context;
var count = 50;
var mouseX = 0;
var mouseY = 0;
var playerX = 100;
var playerY = 100;
var playerMass = 50;
var balls = [];
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



function draw() {
    requestAnimationFrame(draw);
    context.fillStyle="white";
    context.fillRect(0,0,window.innerWidth,window.innerHeight);
    var x = mouseX-playerX;
    var y = mouseY-playerY;
    var a = x > 0 ? Math.atan(y/x) : Math.atan(y/x)+Math.PI;
    var gotoX = Math.cos(a)*(100/playerMass);
    var gotoY = Math.sin(a)*(100/playerMass);
    playerX += gotoX;
    playerY += gotoY;
    context.fillStyle="blue";
    context.beginPath();
    context.arc(playerX,playerY,playerMass,0,2*Math.PI);
    context.fill();
    context.stroke();
}
