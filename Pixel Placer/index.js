"use strict";
var nickname;
var table;
var oldX;
var oldY;
var lastTimeModified;
var newX;
var newY;
var currentColor;
var oldColor = null;
var submit;
var row;
var stats = {};
var pixelSelected = false;
var onCooldown = false;
var cooldownSeconds;
var database = firebase.database();
var pixelRef = database.ref('Pixels/');
var countdownInterval;
var submitted = false;


// cell3 helper functions
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function revertPixel() {
    if (oldColor === null){
        return;
    }
    // use oldColor variable to set old rectangle back to what it was
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.putImageData(oldColor, oldX, oldY);
    
    // dont get pixel stats
}

function sendRequest(newX, newY, currentColor){
    submitted = true;
    pixelSelected = false;
    var time = Date.now();
    var nick = nickname.val();
    if (nick === null){
        nick = "name";
    }
    else if (nick.length === 0){
        nick = "name";
    }
    pixelRef.child(newX + "," + newY).update({
        Color : currentColor,
        ModBy : nick,
        ModTime : time
    });
    var d = new Date();
    d.setTime(time)
    stats["lastModified"].innerHTML = d.toLocaleString();
    stats["modifiedBy"].innerHTML = nick;
    startCooldown();
}

function startCooldown(){
    cooldownSeconds = 5;
    stats["cooldown"].textContent = 5;
    stats["ready"].style.display = "none";
    stats["timer"].style.display = "block";
    onCooldown = true;
    submit.disabled = true;
    countdownInterval = setInterval(timer, 1000);
}

function timer(){
    cooldownSeconds--;
    if (cooldownSeconds === 0){
        onCooldown = false;
        checkButton();
        stats["timer"].style.display = "none";
        stats["ready"].style.display = "block";
        stats["plural"].style.display = "inline"
        clearInterval(countdownInterval);
    }
    else {
        if (cooldownSeconds === 1){
            stats["plural"].style.display = "none";
        }
        stats["cooldown"].textContent = cooldownSeconds;
    }
}

function checkButton(){
    if (!onCooldown && pixelSelected){
        submit.disabled = false;
    }
    else {
        submit.disabled = true;
    }
}

function getPixelStats(x, y, currentColor){
    
    newX = (x - 1)/10;
    newY = (y - 1)/10;

    var cell1 = stats["location"];
    cell1.innerHTML = newX + "," + newY;

    var cell2 = stats["currentColor"];
    cell2.innerHTML = currentColor;

    var cell3 = stats["previousColor"];
    let hex = rgbToHex(oldColor.data[0], oldColor.data[1], oldColor.data[2]);
    cell3.innerHTML = hex;
    
    pixelRef.child(newX + "," + newY).once("value", snapshot => {
        if (snapshot.exists()){
            var data = snapshot.val();
            var oldname = data["ModBy"];
            var time = data["ModTime"];
            var d = new Date();
            d.setTime(time);
            stats["lastModified"].innerHTML = d.toLocaleString();
            stats["modifiedBy"].innerHTML = oldname;
        }
        else {
            stats["lastModified"].innerHTML = "";
            stats["modifiedBy"].innerHTML = "";
        }
    });
    
    checkButton();
    oldX = x;
    oldY = y;
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
        let posX = evt.clientX - rect.left;
        let posY = evt.clientY - rect.top;
        var data = {
            x: posX - (posX % 10) + 1,
            y: posY - (posY % 10) + 1
          };
        return data;
}

function fillPixels(mousePos) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var color = document.getElementById("colorselector");
    if (submitted) {
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
    submitted = false;
}

function drawCanvas() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.addEventListener('click', function(evt){
        pixelSelected = true;
        var mousePos = getMousePos(c, evt);
        fillPixels(mousePos);
        
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
    stats["location"] = document.getElementById("location");
    stats["currentColor"] = document.getElementById("currentColor");
    stats["previousColor"] = document.getElementById("previousColor");
    stats["lastModified"] = document.getElementById("lastModified");
    stats["modifiedBy"] = document.getElementById("modifiedBy");
    stats["cooldown"] = document.getElementById("cooldown");
    stats["ready"] = document.getElementById("ready");
    stats["timer"] = document.getElementById("timer");
    stats["plural"] = document.getElementById("plural");

    pixelRef.on('child_changed', (snapshot, oldSnap) =>{
        if (snapshot.exists()){
            var data = snapshot.key;
            data = data.split(",");
            var column = data[0];
            var row = data[1];
            var color = snapshot.child('Color/').val();

            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = color;
            var ewX = (column * 10) + 1;
            var ewY = (row * 10) + 1;
            ctx.fillRect(ewX, ewY, 9, 9);

        }
    });

    //colors pixels on page load
    pixelRef.on('child_added', (snapshot, oldSnap) =>{
        if (snapshot.exists()){
            var data = snapshot.key;
            data = data.split(",");
            var column = data[0];
            var row = data[1];
            var color = snapshot.child('Color/').val();

            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = color;
            var ewX = (column * 10) + 1;
            var ewY = (row * 10) + 1;
            ctx.fillRect(ewX, ewY, 9, 9);

        }
    });
    setTimeout(promptName, 500);
}

function promptName(){
    var nick = window.prompt("Please enter a nickname to use Pixel Placer", "name");
    if (nick === null){
        nick = "name";
    }
    else if (nick.length === 0){
        nick = "name";
    }
    nickname.val(nick);
}

$(document).ready( () => {
    nickname = $("#nicknameinput");
    submit = document.getElementById("submitbtn");
    submit.addEventListener('click',function(evt){
        sendRequest(newX, newY, currentColor);
    }, false);
    init();
});