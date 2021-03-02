
/*
Author: Jake Olson 
Date: 3/2/2021

Description:
This program creates one rotating square around origin 
and a triangle that oribits around the origin 
it also allows user to change the speed and direction of both objects
either together or seperatly 

Proposed points: 9.5/10 because my readability probably isnt perfect 

Keys:
D,d - change direction for both shapes
S,s - slows speed for both shapes
F,f - increases speed for both shapes

*/

"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var theta2 = 0.0;
var thetaLoc2;
var direction = true;
var direction2 = true;
var timesPressed = 0;
var speed = 0.1;
var speed2 = 0.1;
var program;
var vertices;
var verticesTriangle;
var programTriangle;
var colors;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // creates the vertices for the square
    vertices = [
        vec2(0, .5),
        vec2(-.5, 0),
        vec2(.5, 0),
        vec2(0, -.5)
    ];
    //creates the vertices for the triangle
    verticesTriangle = [
        vec2(.6,.6),
        vec2(1,.6),
        vec2(.8,1)
    ];
    // creates color that will be used for the square
     colors = [
        vec3(1.0,0.1, 0.0),
        vec3(0.1,0.5, 0.5),
        vec3(0.1,0.5, 0.5),
        vec3(1.0,0.1, 0.0)
        
    ];




    
    

    // estabilishes the shaders that will be used for the triangle
    programTriangle = initShaders(gl, "vertex-shader-tri", "fragment-shader-tri");
    

    // when change rotation button is clicked the direction of both objects change
    document.getElementById("Direction").onclick = function(){
        timesPressed++;
        console.log("pressed button " + timesPressed);
        direction = !direction;
        direction2 = !direction2;
    }
    // changes the speed for both objects depending on the value for the slider
    document.getElementById("slider").onchange = function(event){
        speed = parseFloat(event.target.value);
        speed2 = parseFloat(event.target.value);
        console.log("slider!!!", speed);
    }

    // creates the cases for the menu choices 
    //can change speed and direction for both objects seperatly 
    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index){
            case 0: 
                direction = !direction;
                break;
            case 1:
                speed += .1;
                break;
            case 2:
                speed -= .1;
                break;
            case 3: 
                direction2 = !direction2;
                break;
            case 4:
                speed2 += .1;
                break;
            case 5:
                speed2 -= .1;

        }
    }
     
    // changes speed and direction of both objects
    // when any of the following keys are pressed d,D,f,F,s,S 
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
            case 'D'://direction
            case 'd':
                direction = !direction;
                direction2 = !direction2;
                break;
            case 'F': //faster
            case 'f': 
                speed+=.1;
                speed2+=.1;
                break;
            case 'S': //slower
            case 's':
                speed -=.1;
                speed2 -=.1;
                break;
        }
    };

    

    // calls render function
    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    //changes direction and updates speed of square depending on boolean "direction"
    // which can change by the events mentioned earlier like key press
    if (direction == true){
        theta += speed;
    } 
    else {
        theta -=speed;
    }
    //changes direction and updates speed of triangle depending on boolean "direction"
    // this allows for both shapes to change indepent from each other
    if (direction2 == true){
        theta2 -= speed2;
    } 
    else {
        theta2 +=speed2;
    }
    
    // changes the program to "program"
    // loading all the data to the buffer 
    gl.useProgram(program);
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    gl.uniform1f(thetaLoc, theta);
    // draws the square first 4 vertices
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // changes the program to "programTriangle" 
    // loading all the data to the buffer
    gl.useProgram(programTriangle)
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);
    thetaLoc2 = gl.getUniformLocation(programTriangle, "uTheta2");
    gl.uniform1f(thetaLoc2, theta2);
    // draws the triangle 
    gl.drawArrays(gl.TRIANGLES,0,verticesTriangle.length);
   
    requestAnimationFrame(render);
}
