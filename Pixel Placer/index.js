"use strict";
function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}
function fillPixels(mousePos) {
    /*var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.rect(1,1,9.5,9.5);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
    
    ctx.rect(11,1,9.5,9.5);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();*/
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.rect(mousePos.x, mousePos.y, 9.5, 9.5);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
    
}

function drawCanvas() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.addEventListener('click', function(evt){
        var mousePos = getMousePos(c, evt);
        fillPixels(mousePos);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
      }, false);

    var bw=500;
    var bh=500;
    
    for(var x=0; x<=bw; x+=10){
        ctx.moveTo(0.5+ x, 0);
        ctx.lineTo(0.5+ x, bh);
    }
    for(var x=0; x<=bh; x+=10){
        ctx.moveTo(0, 0.5+x);
        ctx.lineTo(bw, 0.5+x);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
    
}

function init() {
    drawCanvas();
    
}