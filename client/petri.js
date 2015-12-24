var canvas;
var context;
var count = 50;
var mouse = {x:100, y:100};
var player = {x:100, y:100, mass:50, colour: "blue"};
var dots = [];
var Tau = 2*Math.PI;
$(function(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
//  var background = new Image();
//  background.src = "background.svg";

//  context.drawImage(background,0,0);
    draw();
    for(i=0;i<80;i++){generateDots();};
    
});
window.addEventListener("mousemove", function(ev){
    mouse.x = ev.clientX; 
    mouse.y = ev.clientY; 
});
//window.addEventListener("click", function(ev){
//    generateDots();
//});
window.addEventListener("resize", function(ev){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function draw() {
    requestAnimationFrame(draw);
    context.fillStyle="white";
    context.fillRect(0,0,window.innerWidth,window.innerHeight);
    dots.forEach(function(e,i){
        checkHit(e,i);
    });
    x = mouse.x-player.x;
    y = mouse.y-player.y;
    a = Math.atan2(y,x);
    moveX = Math.cos(a)*(100/player.mass);
    moveY = Math.sin(a)*(100/player.mass);
    player.x += moveX;
    player.y += moveY;
    drawCircle(player.x,player.y,player.mass,player.colour);
}

function rand(n,l){
    return l?Math.ceil(l-Math.random()*n):Math.ceil(Math.random()*n);
}

function drawCircle(x,y,r,c){
    context.fillStyle=c;
    context.beginPath();
    context.arc(x,y,r,0,Tau);
    context.fill();
    context.stroke();
}

function generateDots(){
    dots.push({
                x:rand(window.innerWidth),
                y:rand(window.innerHeight),
                mass:rand(10,20),
                colour: 'rgb(' + rand(255) + ',' + rand(255) + ',' + rand(255)+')'
            });
}


function checkHit(e,i){

dx = player.x - e.x;
dy = player.y - e.y;
var distance = Math.sqrt(dx * dx + dy * dy);

if (distance < player.mass + e.mass) {
    return player.mass+=0.5, dots.splice(i,1), generateDots();
}
    return drawCircle(e.x,e.y,e.mass,e.colour);
}