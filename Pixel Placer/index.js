"use strict";
var nickname;
var table;
var oldX;
var oldY;
var lastTimeModified;
var newX;
var newY;
var currentColor;
var oldColor;
// cell3 helper function
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
// cell3 helper function
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function revertPixel() {
    // use oldColor variable to set old rectangle back to what it was
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.putImageData(oldColor, oldX, oldY);
    
    // dont get pixel stats
}

function checkCooldown() {
    // let through if first time
    if (lastTimeModified == null) {
        var d = new Date();
        lastTimeModified = d.getTime();
        return true;
    }
    var d = new Date();
    let currentTime = d.getTime();
    if (currentTime - lastTimeModified > 10000) {
        // let submit
        var d = new Date();
        lastTimeModified = d.getTime();
        return true;
    }
    else {
        return false;
    }
}

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
    
    newX = (x - 1)/10;
    newY = (y - 1)/10;
    //Add cells for each element
    
    //Cell 1 = Pixel Location
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = newX + "," + newY;
    
    //Cell 2 = Current Color
    var cell2 = row.insertCell(-1);
    cell2.innerHTML = currentColor;
    
    //Cell 3 = previous color
    //TODO Get request from server for previous color
    var cell3 = row.insertCell(-1);
    let hex = rgbToHex(oldColor.data[0], oldColor.data[1], oldColor.data[2]);
    cell3.innerHTML = hex;
    
    //Cell 4 = Time last Modified
    //TODO Get time last modified by server
    
    //Cell 5 = Last Modified By
    //TODO get name of who it was last modified by from the server
    
    
    
    
    //Enable submit button
    document.getElementById("submitbtn").disabled = false;
    oldX = x;
    oldY = y;
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
        let posX = evt.clientX - rect.left;
        let posY = evt.clientY - rect.top;
        return {
          x: posX - (posX % 10) + 1,
          y: posY - (posY % 10) + 1
        };
}

function fillPixels(mousePos) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var color = document.getElementById("colorselector");
    if (document.getElementById("submitbtn").disabled == true) {
        oldColor = ctx.getImageData(mousePos.x, mousePos.y, 9, 9);
    }
    else {
        revertPixel();
        oldColor = ctx.getImageData(mousePos.x, mousePos.y, 9, 9);
    }
    currentColor = color.value;
    ctx.fillStyle = currentColor;
    ctx.fillRect(mousePos.x, mousePos.y, 9, 9);
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
    var btn = document.getElementById("submitbtn");
    btn.addEventListener('click',function(evt){
        console.log("Button clicked!");
        let bool = checkCooldown();
        if (bool == false) {
            // send popup
            var d = new Date();
            let timeLeft = Math.round(10 - (d.getTime() - lastTimeModified) / 1000);
            var alertMsg = "Oops! You can't submit a new pixel for another " + timeLeft + " seconds!";
            alert(alertMsg);
        }
        else {
            sendRequest(newX, newY, currentColor);
        }
        
    }, false);
});