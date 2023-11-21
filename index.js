

var boardWidth = 600;     
var boardHeight = 600;  //  used in window.onload = function()
var context;
var board;

/*




Controls:

W: Player1 UP
S: Player1 DOWN

Arrow UP: Player2 UP
Arrow DOWN: Player2 DOWN


*/



//load sound effects
var paddleSound = new Audio();
paddleSound.src = "audio/paddle.mp3";
var groundSound = new Audio();
groundSound.src = "audio/wall.mp3";
var scoreSound = new Audio();
scoreSound.src = "audio/score.mp3";



//player and ball params
var player1 = {
    x: 30,
    y: 250,
    width: 10,
    height: 60,
    velocityY: 0,
    points: 0,
}
var player2 = {
    x: 560,
    y: 250,
    width: 10,
    height: 60,
    velocityY: 0,
    points: 0,
}
var ball = {
    x: 300,
    y: 300,
    width: 10,
    height: 10,
    velocityY: 2,
    velocityX: 2,
}


//once window loads do function
window.onload = function(){
    boardSetup();
    keyListener();
    requestAnimationFrame(update);
}
function update(){
    requestAnimationFrame(update); //for refreshing the canvas
    drawPaddles();
    PaddleCollisions();
    BallCollisions();
    drawText();
}

//canvas setup (board == canvas)
function boardSetup(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
}

//keypress listener, and once key is up call function keyup
function keyListener(){
    document.addEventListener("keyup", keyup);
}





function keyup(e){

    //player1
    if (e.code == "KeyW"){
        player1.velocityY = -4; // if W pressed increase player1 momentum 4UP
    }
    if (e.code == "KeyS"){
        player1.velocityY = 4; // if S pressed decrease player1 momentum 4DOWN
    }

    //player2
    if (e.code == "ArrowUp"){
        player2.velocityY = -4; // if ArrowUP pressed increase player2 momentum 4UP
    }
    if (e.code == "ArrowDown"){
        player2.velocityY = 4; // if ArrowDOWN pressed increase player2 momentum 4DOWN
    }

}

function drawPaddles(){

//clear the board
context.clearRect(0, 0, board.width, board.height);

//draw paddle 1/2
context.fillStyle = "white";
context.fillRect(player1.x, player1.y, player1.width, player1.height);
context.fillStyle = "white";
context.fillRect(player2.x, player2.y, player2.width, player2.height);

//add movement to the players
player1.y += player1.velocityY;
player2.y += player2.velocityY;
}


function PaddleCollisions(){


    // if player 1 hits the ceiling stop the player
    if (player1.y == 0){
        player1.velocityY = 0;
    }
    if (player1.y < 0){
        player1.y = 0;
    }


    // if player 1 hits the ground stop the player
    if (player1.y == 540){
        player1.velocityY = 0;
    }
    if (player1.y > 540){
        player1.y = 540;
    }

    // if player 2 hits the ground stop the player
    if (player2.y == 0){
        player2.velocityY = 0;
    }
    if (player2.y < 0){
        player2.y = 0;
    }

    // if player 2 hits the ground stop the player
    if (player2.y == 540){
        player2.velocityY = 0;
    }
    if (player2.y > 540){
        player2.y = 540;
    }

}


function BallCollisions(){
    //draw the ball
    context.fillStyle = "white";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //add movement to the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;



    //if ball hits ground invert direction
    if (ball.y == 590){
        groundSound.play();
        ball.velocityY *= -1;
    }

    //if ball hits ceiling invert direction
    if (ball.y == 0){
        groundSound.play();
        ball.velocityY *= -1;
    }
    //if ball hits right wall give player1 points and invert the ball + return to default xpos
    if (ball.x == 600){
        scoreSound.play();
        ball.velocityX *= -1;
        ball.x = 300;
        player1.points++;
    }
    //if ball hits left wall give player2 points and invert the ball + return to default xpos
    if (ball.x == -10){
        scoreSound.play();
        ball.velocityX *= -1;
        ball.x = 300;
        player2.points++;
    }
    //if ball hits player1 paddle invert the ball
    if (detectCollision(player1, ball)){
        paddleSound.play();
        ball.velocityX *= -1;
    }
    //if ball hits player2 paddle invert the ball
    if (detectCollision(player2, ball)){
        paddleSound.play();
        ball.velocityX *= -1;
    }


}

function drawText(){
    //player1 points display
    context.font = "Trickster";
    context.fillText(player1.points, 150, 80);

    //drawing the squares in the background
    for (let i = 0; i < 25; i++){
    context.fillStyle = "white";
    context.fillRect(300, [i]*40+15, 10, 10);
    }

    //player2 points display
    context.font = "40px Trickster";
    context.fillText(player2.points, 420, 80);
}




function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && // for detecting square collisions
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}