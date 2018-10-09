//variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const playerPoints = document.querySelector(".pointsPlayer");
const computerPoints = document.querySelector(".pointsComputer");
const resetButton = document.querySelector(".reset");
let activeGame = true;
let activeMouse = true;
let activeKeyboard = true;
let gameWidth;
let playerWins = 0;
let computerWins = 0;
let difficult = 0.1;

//************************
//ADMIN MODE CONFIGURATION (if not used, all comment)
// let adminMode = false;

//setting canvas size
canvas.width = 1000;
canvas.height = 500;

const refreshGameWindow = () => {
    gameWidth = canvas.width;
    paddleComputer.positionX = canvas.width - paddleComputer.width - 10;
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
            paddlePlayer.moveUp(collisionObjects);
        else if (e.keyCode == 83)
            paddlePlayer.moveDown(collisionObjects);
        if (e.keyCode == 80)
            paddleComputer.moveUp(collisionObjects);
        else if (e.keyCode == 186)
            paddleComputer.moveDown(collisionObjects);
    }
}

canvas.addEventListener("mousemove", mouseSupportForPlayer);
window.addEventListener("keydown", keyboardSupportForPlayer);
resetButton.addEventListener("click", () => {
    clearInterval(timer);
    playerWins = 0;
    computerWins = 0;
    ballsGame.forEach(ballGame => {
        ballGame.resetBall();
    })
    timer = setInterval(run, 1000 / 60);
});

const clearScreen = () => {
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//array with all activ game elements (paddels, balls)
const collisionObjects = [];
const ballsGame = [];

//object Paddle
function Paddle(width, height, color, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.middleHeight = this.height / 2;
    this.middleWidth = this.width / 2;
    this.speed = 3;

    this.autoMove = (collisionObjects) => {
        let minX = canvas.width;
        let tempMinX = canvas.width;
        let tempObject;
        for (let i = 0; i < collisionObjects.length; i++) {
            if ((collisionObjects[i].positionX === this.positionX) && (collisionObjects[i].positionY === this.positionY))
                continue;
            if (collisionObjects[i].positionX > this.positionX) {
                tempMinX = collisionObjects[i].positionX - this.positionX;
            } else {
                tempMinX = this.positionX - collisionObjects[i].positionX;
            }
            if (tempMinX < minX) {
                minX = tempMinX;
                tempObject = i;
            }

        }
        console.log((collisionObjects[tempObject].positionY + collisionObjects[tempObject].middleHeight), (this.positionY + this.middleHeight));
        if ((collisionObjects[tempObject].positionY + collisionObjects[tempObject].middleHeight) > (this.positionY + this.middleHeight)) {
            if (minX > (canvas.width / 2)) {
                console.log(1);
                this.moveDown(collisionObjects);
            } else {
                console.log(2);
                this.speed *= 1.4;
                this.moveDown(collisionObjects);
                this.speed *= 0.71428;
                this.speed = Math.round(this.speed);
            }

        } else {
            if (minX > (canvas.width / 2)) {
                console.log(3);
                this.moveUp(collisionObjects);
            } else {
                console.log(4, minX, collisionObjects[tempObject].positionY, this.positionY);
                this.speed *= 1.4;
                this.moveUp(collisionObjects);
                this.speed *= 0.71428;
                this.speed = Math.round(this.speed);
            }

        }
    }

    this.moveUp = (collisionObjects) => {
        let collision = false;
        let paddelTopRightX = this.positionX + this.width;
        let paddelTopRightY = this.positionY - this.speed;
        let paddelBottomY = this.positionY + this.height;
        let objectBottomLeftY;
        for (let i = 0; i < collisionObjects.length; i++) {
            if ((this.positionX == collisionObjects[i].positionX) && (this.positionY == collisionObjects[i].positionY))
                continue;
            objectBottomLeftY = collisionObjects[i].positionY + collisionObjects[i].height;
            if ((paddelTopRightX > collisionObjects[i].positionX && this.positionX < collisionObjects[i].positionX + collisionObjects[i].width) && (paddelTopRightY < objectBottomLeftY && paddelBottomY > collisionObjects[i].positionY)) {
                this.positionY = objectBottomLeftY;
                collision = !collision;
                break;
            } else if (paddelTopRightY < 0) {
                this.positionY = 0;
                collision = !collision;
                break;
            }
        }
        if (!collision)
            this.positionY = paddelTopRightY;
    };

    this.moveDown = (collisionObjects) => {
        let collision = false;
        let paddelBottomRightX = this.positionX + this.width;
        let paddelBottomRightY = this.positionY + this.height + this.speed;
        let objectTopLeftY;
        for (let i = 0; i < collisionObjects.length; i++) {
            if ((this.positionX == collisionObjects[i].positionX) && (this.positionY == collisionObjects[i].positionY))
                continue;
            objectTopLeftY = collisionObjects[i].positionY;
            if ((paddelBottomRightX > collisionObjects[i].positionX && this.positionX < collisionObjects[i].positionX + collisionObjects[i].width) && (paddelBottomRightY > objectTopLeftY && this.positionY < objectTopLeftY + collisionObjects[i].height)) {
                this.positionY = objectTopLeftY - this.height;
                collision = !collision;
                break;
            } else if (paddelBottomRightY > canvas.height) {
                this.positionY = canvas.height - this.height;
                collision = !collision;
                break;
            }
        }
        if (!collision)
            this.positionY += this.speed;
    };
}

function Ball(size, color, positionX, positionY) {
    this.width = size;
    this.height = size;
    this.positionX = positionX;
    this.positionY = positionY;
    this.color = color;
    this.middleHeight = size / 2;
    this.speedX = 2;
    this.speedY = 2;
    //direction true -> right, down; false -> left, up
    this.directionX = true;
    this.directionY = true;
    this.resetBall = () => {
        this.speedX = 2;
        this.speedY = 2;
        if (Math.round(Math.random()))
            this.directionX = true;
        else
            this.directionX = false
        if (Math.round(Math.random()))
            this.directionY = true;
        else
            this.directionY = false;
        this.positionX = canvas.width / 2 - (this.width / 2);
        this.positionY = canvas.height / 2 - (this.height / 2);
    }
    this.move = collisionObjects => {
        let ballTopLeftX;
        let ballTopLeftY;
        let ballBottomRightX;
        let ballBottomRightY;
        let objectTopLeftX;
        let objectTopLeftY;
        let objectBottomRightX;
        let objectBottomRightY;
        let collision = 0;

        if (this.directionX && this.directionY) {
            ballTopLeftX = this.positionX + this.speedX;
            ballTopLeftY = this.positionY + this.speedY;
            ballBottomRightX = this.positionX + this.width + this.speedX;
            ballBottomRightY = this.positionY + this.height + this.speedY;
            for (let i = 0; i < collisionObjects.length; i++) {
                objectTopLeftX = collisionObjects[i].positionX;
                objectTopLeftY = collisionObjects[i].positionY;
                objectBottomRightX = collisionObjects[i].positionX + collisionObjects[i].width;
                objectBottomRightY = collisionObjects[i].positionY + collisionObjects[i].height;
                if ((objectTopLeftX == ballTopLeftX - this.speedX) && (objectTopLeftY == ballTopLeftY - this.speedY)) {;
                    continue;
                }
                if ((ballBottomRightX > objectTopLeftX && ballBottomRightX < objectBottomRightX) && (ballBottomRightY > objectTopLeftY && ballTopLeftY < objectBottomRightY)) {
                    collision = 1;
                    break;
                } else if (ballBottomRightX > canvas.width) {
                    collision = 2;
                    playerWins++;
                    break;
                } else if (ballBottomRightY > canvas.height) {
                    collision = 3;
                    break;
                }
            };
        } else if (this.directionX && !this.directionY) {
            ballTopLeftX = this.positionX + this.speedX;
            ballTopLeftY = this.positionY - this.speedY;
            ballBottomRightX = this.positionX + this.width + this.speedX;
            ballBottomRightY = this.positionY + this.height - this.speedY;
            for (let i = 0; i < collisionObjects.length; i++) {
                objectTopLeftX = collisionObjects[i].positionX;
                objectTopLeftY = collisionObjects[i].positionY;
                objectBottomRightX = collisionObjects[i].positionX + collisionObjects[i].width;
                objectBottomRightY = collisionObjects[i].positionY + collisionObjects[i].height;
                if ((objectTopLeftX == ballTopLeftX - this.speedX) && (objectTopLeftY == ballTopLeftY - this.speedY)) {
                    continue;
                }
                if ((ballBottomRightX > objectTopLeftX && ballBottomRightX < objectBottomRightX) && (ballTopLeftY < objectBottomRightY && ballBottomRightY > objectTopLeftY)) {
                    collision = 1;
                    break;
                } else if (ballBottomRightX > canvas.width) {
                    collision = 2;
                    playerWins++;
                    break;
                } else if (ballTopLeftY < 0) {
                    collision = 3;
                    break;
                }
            };
        } else if (!this.directionX && this.directionY) {
            ballTopLeftX = this.positionX - this.speedX;
            ballTopLeftY = this.positionY + this.speedY;
            ballBottomRightX = this.positionX + this.width - this.speedX;
            ballBottomRightY = this.positionY + this.height + this.speedY;
            for (let i = 0; i < collisionObjects.length; i++) {
                objectTopLeftX = collisionObjects[i].positionX;
                objectTopLeftY = collisionObjects[i].positionY;
                objectBottomRightX = collisionObjects[i].positionX + collisionObjects[i].width;
                objectBottomRightY = collisionObjects[i].positionY + collisionObjects[i].height;
                if ((objectTopLeftX == ballTopLeftX - this.speedX) && (objectTopLeftY == ballTopLeftY - this.speedY)) {
                    continue;
                }
                if ((ballTopLeftX < objectBottomRightX && ballTopLeftX > objectTopLeftX) && (ballBottomRightY > objectTopLeftY && ballTopLeftY < objectBottomRightY)) {
                    collision = 1;
                    break;
                } else if (ballTopLeftX < 0) {
                    collision = 2;
                    computerWins++;
                    break;
                } else if (ballBottomRightY > canvas.height) {
                    collision = 3;
                    break;
                }
            };
        } else {
            ballTopLeftX = this.positionX - this.speedX;
            ballTopLeftY = this.positionY - this.speedY;
            ballBottomRightX = this.positionX + this.width - this.speedX;
            ballBottomRightY = this.positionY + this.height - this.speedY;
            for (let i = 0; i < collisionObjects.length; i++) {
                objectTopLeftX = collisionObjects[i].positionX;
                objectTopLeftY = collisionObjects[i].positionY;
                objectBottomRightX = collisionObjects[i].positionX + collisionObjects[i].width;
                objectBottomRightY = collisionObjects[i].positionY + collisionObjects[i].height;
                if ((objectTopLeftX == ballTopLeftX - this.speedX) && (objectTopLeftY == ballTopLeftY - this.speedY)) {
                    continue;
                }
                if ((ballTopLeftX < objectBottomRightX && ballTopLeftX > objectTopLeftX) && (ballTopLeftY < objectBottomRightY && ballBottomRightY > objectTopLeftY)) {
                    collision = 1;
                    break;
                } else if (ballTopLeftX < 0) {
                    collision = 2;
                    computerWins++;
                    break;
                } else if (ballTopLeftY < 0) {
                    collision = 3;
                    break;
                }
            };
        }
        if (collision) {
            if (Math.round(Math.random()))
                this.speedX += difficult + (Math.random() / 10);
            else
                this.speedY += difficult + (Math.random() / 10);
            if (collision == 1) {
                this.directionX = !this.directionX;
            } else if (collision == 2) {
                this.resetBall();
            } else {
                this.directionY = !this.directionY;
            }

        } else {
            this.positionX = ballTopLeftX;
            this.positionY = ballTopLeftY;
        }
    }
};

const ball = new Ball(20, "black", canvas.width / 2 - 10, canvas.height / 2 - 10);
const ball2 = new Ball(20, "blue", canvas.width / 2 - 10, canvas.height / 2 - 10);
const ball3 = new Ball(30, "pink", canvas.width / 2 - 15, canvas.height / 2 - 15);
const ball4 = new Ball(50, "orange", canvas.width / 2 - 25, canvas.height / 2 - 25);

const paddlePlayer = new Paddle(20, 100, "green", 10, 10);
const paddleComputer = new Paddle(20, 100, "red", 0, 10);

collisionObjects.push(paddlePlayer, paddleComputer, ball, ball2);
ballsGame.push(ball, ball2);

//function drawing object on canvas
const drawObject = (drawingObjects, context) => {
    drawingObjects.forEach(drawingObject => {
        context.lineJoin = "round";
        context.fillStyle = drawingObject.color;
        context.fillRect(drawingObject.positionX, drawingObject.positionY, drawingObject.width, drawingObject.height);
    })

}

const ballsMove = ballsGame => {
    ballsGame.forEach(ballGame => {
        ballGame.move(collisionObjects);
    });
}

const updateScore = () => {
    playerPoints.textContent = playerWins;
    computerPoints.textContent = computerWins;
}

const run = () => {
    if (!(canvas.width === gameWidth))
        refreshGameWindow();
    clearScreen();
    ballsMove(ballsGame);
    paddleComputer.autoMove(collisionObjects);
    drawObject(collisionObjects, ctx);
    updateScore();
    if (playerWins > 9 || computerWins > 9)
        clearInterval(timer);
}

let timer = setInterval(run, 1000 / 60);