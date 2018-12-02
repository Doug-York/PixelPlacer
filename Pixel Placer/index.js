"use strict";
function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}
function fillPixels(mousePos) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var color = document.getElementById("colorselector");
    var currentColor = color.value;
    let x = mousePos.x - (mousePos.x % 10) + .5;
    let y = mousePos.y - (mousePos.y % 10) + .5;
    ctx.stroke();
    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, 9.5, 9.5);
    
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