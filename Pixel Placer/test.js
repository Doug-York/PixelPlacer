"use strict";
function drawCanvas() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
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

function fillPixels() {
    /*var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.rect(0,0,10,10);
    ctx.stroke();
    ctx.fill();*/
    
    
}
function init() {
    drawCanvas();
    fillPixels();
    
}