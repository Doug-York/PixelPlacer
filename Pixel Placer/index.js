"use strict";
var nickname;
var table;
function sendRequest(newX, newY, currentColor){
    console.log("Processing Request with x: "+newX+" y: "+newY+" current color: "+currentColor+" nickname: "+nickname.val());
    
    //TODO send request to server
    
    
    document.getElementById("submitbtn").disabled = true;
}

function getPixelStats(x, y, currentColor){
    var table = document.getElementById("statstable");
    var count = document.getElementById("statstable").rows.length;
    console.log("Num rows: "+count);
    if(count>1){
        table.deleteRow(1);
    }
    var row = table.insertRow(-1);
    
    var newX = (x-0.5)/10;
    var newY = (y-0.5)/10;
    //Add cells for each element
    
    //Cell 1 = Pixel Location
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = newX + "," + newY;
    
    //Cell 2 = Current Color
    var cell2 = row.insertCell(-1);
    cell2.innerHTML = currentColor;
    
    //Cell 3 = previous color
    //TODO Get request from server for previous color
    
    //Cell 4 = Time last Modified
    //TODO Get time last modified by server
    
    //Cell 5 = Last Modified By
    //TODO get name of who it was last modified by from the server
    
    
    
    
    //Enable submit button
    document.getElementById("submitbtn").disabled = false;
    
    var btn = document.getElementById("submitbtn");
    btn.addEventListener('click',function(evt){
        console.log("Button clicked!");
        sendRequest(newX, newY, currentColor);
    }, false);
    
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
        let posX = evt.clientX - rect.left;
        let posY = evt.clientY - rect.top;
        return {
          x: posX - (posX % 10) + .5,
          y: posY - (posY % 10) + .5
        };
}

function fillPixels(mousePos) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var color = document.getElementById("colorselector");
    var currentColor = color.value;
    ctx.fillStyle = currentColor;
    ctx.fillRect(mousePos.x, mousePos.y, 9.5, 9.5);
    getPixelStats(mousePos.x, mousePos.y, currentColor);
    
}

function drawCanvas() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.addEventListener('click', function(evt){
        console.log(nickname.val());
        if(nickname.val().length==0){
            alert("Please enter a nickname before you select a pixel");
        }
        else{
            var mousePos = getMousePos(c, evt);
            fillPixels(mousePos);
            var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
            console.log(message);
        }
        
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

$(document).ready( () => {
    nickname = $("#nicknameinput");
});
