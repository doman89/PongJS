//variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let activeGame = true;
let activeMouse = true;
let activeKeyboard = true;
let gameWidth;

//************************
//ADMIN MODE CONFIGURATION (if not used, all comment)
// let adminMode = false;

//setting canvas size
canvas.width = 500;
canvas.height = 200;

const refreshGameWindow = () => {
    gameWidth = canvas.width;
    paddleComputer.positionX = canvas.width - 20;
}

function mouseSupportForPlayer(e) {
    if (activeGame && activeMouse) {
        if (e.clientY - canvas.offsetTop > paddlePlayer.middleHeight && e.clientY - canvas.offsetTop < canvas.offsetHeight - paddlePlayer.middleHeight) {
            paddlePlayer.positionY = e.clientY - canvas.offsetTop - paddlePlayer.middleHeight;
        }
    }
};

function keyboardSupportForPlayer(e) {
    if (activeKeyboard) {
        if (e.keyCode == 87)
            paddlePlayer.moveUp();
        else if (e.keyCode == 83)
            paddlePlayer.moveDown();
    }
}

canvas.addEventListener("mousemove", mouseSupportForPlayer);
window.addEventListener("keydown", keyboardSupportForPlayer);

const clearScreen = () => {
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//object Paddle
function Paddle(width, height, color, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.middleHeight = this.height / 2;
    this.middleWidth = this.width / 2;
    this.speed = 10;

    this.moveUp = () => {
        if (this.positionY - this.speed > 0)
            this.positionY -= this.speed;
        else if (this.positionY > 0)
            this.positionY = 0;
    };

    this.moveDown = () => {
        if (this.positionY + this.speed < canvas.height - this.height)
            this.positionY += this.speed;
        else if (this.positionY < canvas.height - this.height)
            this.positionY = canvas.height - this.height;
    };
};

function Ball(size, color, positionX, positionY) {
    this.width = size;
    this.height = size;
    this.positionX = positionX;
    this.positionY = positionY;
    this.color = color;
    this.middleBall = size / 2;
    this.speedX = 1;
    this.speedY = 0;
    //direction true -> right, down; false -> left, up
    this.directionX = true;
    this.directionY = true;
    // 1 - player win, 2 - enemy win, 0 - not end;
    this.move = () => {
        if (this.directionX) {
            if (this.positionX + this.width < canvas.width) {
                this.positionX += this.speedX;
            } else {
                this.positionX = canvas.width - this.width;
                this.directionX = false;
                return 1;
            }
        } else {
            if (this.positionX - this.speedX > 0)
                this.positionX -= this.speedX;
            else {
                this.positionX = 0;
                this.directionX = true;
                return 2;
            }

        }
        if (this.directionY) {
            if (this.positionY + this.height < canvas.height) {
                this.positionY += this.speedY;
            } else {
                this.positionY = canvas.height - this.height;
                this.directionY = false;
            }
        } else {
            if (this.positionY - this.speedY > 0)
                this.positionY -= this.speedY;
            else {
                this.positionY = 0;
                this.directionY = true;
            }
        }
    }
}

const ball = new Ball(10, "black", canvas.width / 2 - 5, canvas.height / 2 - 5);

let paddlePlayer = new Paddle(10, 50, "green", 10, 10);
const paddleComputer = new Paddle(10, 50, "red", canvas.width - 20, 10);

//function drawing object on canvas
const drawObject = (drawingObject, context) => {
    context.fillStyle = drawingObject.color;
    context.fillRect(drawingObject.positionX, drawingObject.positionY, drawingObject.width, drawingObject.height);
}

const run = () => {
    if (!(canvas.width === gameWidth))
        refreshGameWindow();
    clearScreen();
    // movePlayer(paddlePlayer);
    ball.move();
    paddleComputer.moveDown(10);
    drawObject(paddlePlayer, ctx);
    drawObject(paddleComputer, ctx);
    drawObject(ball, ctx);
    // console.log(readMousePositionF);
}

setInterval(run, 1000 / 60);