class Paddle {
    constructor(positionX = 10, positionY = 10, width = 20, height = 100, color = 'white') {
        this.width = width;
        this.height = height;
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        this.middleHeight = height / 2;
        this.middleWidth = width / 2;
        this.speed = 6;
    }
    autoMove(ballsGame) {
        // console.log('ok');
        let minX = canvas.width; //minimal value of distance 
        let tempMinX = canvas.width; //temprorary distance value of iteration
        let tempObject; //number of object with the smallest distance
        for (let i = 0; i < ballsGame.length; i++) {
            if (ballsGame[i].positionX > this.positionX) {
                tempMinX = ballsGame[i].positionX - this.positionX;
            } else {
                tempMinX = this.positionX - ballsGame[i].positionX;
            }
            if (tempMinX < minX) {
                minX = tempMinX;
                tempObject = i;
            }

        }
        if (ballsGame[tempObject].positionY + ballsGame[tempObject].middleHeight > this.positionY + this.middleHeight) {

            if (minX > (canvas.width / 2)) {
                this.moveDown(ballsGame);
            } else {
                this.speed *= 1.4;
                this.moveDown(ballsGame);
                this.speed *= 0.71428;
                this.speed = Math.round(this.speed);
            }

        } else {
            // console.log("ok");
            if (minX > (canvas.width / 2)) {
                this.moveUp(ballsGame);
            } else {
                this.speed *= 1.4;
                this.moveUp(ballsGame);
                this.speed *= 0.71428;
                this.speed = Math.round(this.speed);
            }

        }
    }
    moveUp(collisionObjects) {
        let collision = false;
        const paddelLeft = this.positionX;
        const paddelRight = this.positionX + this.width;
        const paddelTop = this.positionY;
        let objectBottom;
        let objectLeft;
        let objectRight;
        for (let i = 0; i < collisionObjects.length; i++) {
            if (this === collisionObjects[i])
                continue;
            objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
            objectLeft = collisionObjects[i].positionX;
            objectRight = collisionObjects[i].positionX + collisionObjects[i].width;

            if (((paddelLeft <= objectLeft && objectLeft <= paddelRight) || (paddelLeft <= objectRight && objectRight <= paddelRight)) && (paddelTop >= objectBottom && (paddelTop - this.speed <= objectBottom))) {
                this.positionY = objectBottom;
                collision = !collision;
                break;
            } else if (paddelTop - this.speed < 0) {
                this.positionY = 0;
                collision = !collision;
                break;
            }
        }
        if (!collision)
            this.positionY -= this.speed;
    }
    moveDown(collisionObjects) {
        let collision = false;
        const paddelLeft = this.positionX;
        const paddelRight = this.positionX + this.width;
        const paddelBottom = this.positionY + this.height;
        let objectTop;
        let objectLeft;
        let objectRight;
        for (let i = 0; i < collisionObjects.length; i++) {
            if (this === collisionObjects[i])
                continue;
            objectTop = collisionObjects[i].positionY;
            objectLeft = collisionObjects[i].positionX;
            objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
            if (((paddelLeft <= objectLeft && objectLeft <= paddelRight) || (paddelLeft <= objectRight && objectRight <= paddelRight)) && (paddelBottom <= objectTop && (paddelBottom + this.speed >= objectTop))) {
                this.positionY = objectTop - this.height;
                collision = !collision;
                break;
            } else if (paddelBottom + this.speed > canvas.height) {
                this.positionY = canvas.height - this.height;
                collision = !collision;
                break;
            }
        }
        if (!collision)
            this.positionY += this.speed;
    }
}

class Ball {

    constructor(size = 20, color = 'white', positionX = canvas.width / 2 - size / 2, positionY = canvas.height / 2 - size / 2) {
        this.width = size;
        this.height = size;
        this.positionX = positionX;
        this.positionY = positionY;
        this.color = color;
        this.middleHeight = size / 2;
        this.speedX = 2;
        this.speedY = 2;
        this.directionX = true; //true -> right
        this.directionY = true; //true -> down
    }
    resetBall() {
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
    move(collisionObjects) {
        const ballLeft = this.positionX;
        const ballRight = this.positionX + this.width;
        const ballBottom = this.positionY + this.width;
        const ballTop = this.positionY;
        let collision = 0;

        if (this.directionX && this.directionY) {
            for (let i = 0; i < collisionObjects.length; i++) {
                let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                let objectLeft = collisionObjects[i].positionX;
                let objectTop = collisionObjects[i].positionY;
                let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
                if (this === collisionObjects[i])
                    continue;
                else if (((objectLeft <= ballRight && ballRight <= objectRight) || (objectLeft <= ballLeft && ballLeft <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                    this.directionX != this.directionX;
                    break;
                }
                if ((ballLeft < objectRight && ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight) || (objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                } else if (ballRight + this.speedX > canvas.width) {
                    collision = 2;
                    playerWins++;
                    break;
                } else if (ballBottom + this.speedY > canvas.height) {
                    collision = 3;
                    break;
                }
            };
        } else if (this.directionX && !this.directionY) {
            for (let i = 0; i < collisionObjects.length; i++) {
                let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                let objectLeft = collisionObjects[i].positionX;
                let objectTop = collisionObjects[i].positionY;
                let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
                if (this === collisionObjects[i])
                    continue;
                else if (((objectLeft <= ballRight && ballRight <= objectRight) || (objectLeft <= ballLeft && ballLeft <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                    this.directionX != this.directionX;
                    break;
                }
                if ((ballLeft < objectRight && ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight) || (objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                } else if (ballRight + this.speedX > canvas.width) {
                    collision = 2;
                    playerWins++;
                    break;
                } else if (ballTop - this.speedY < 0) {
                    collision = 3;
                    break;
                }
            };
        } else if (!this.directionX && this.directionY) {
            for (let i = 0; i < collisionObjects.length; i++) {
                let objectLeft = collisionObjects[i].positionX;
                let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                let objectTop = collisionObjects[i].positionY;
                let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
                if (this === collisionObjects[i])
                    continue;
                else if (((objectLeft <= ballRight && ballRight <= objectRight) || (objectLeft <= ballLeft && ballLeft <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                    this.directionX != this.directionX;
                    break;
                }
                if ((ballRight > objectLeft && ((objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight) || (objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                } else if (ballLeft - this.speedX < 0) {
                    collision = 2;
                    computerWins++;
                    break;
                } else if (ballBottom + this.speedY > canvas.height) {
                    collision = 3;
                    break;
                }
            };
        } else {
            for (let i = 0; i < collisionObjects.length; i++) {
                let objectLeft = collisionObjects[i].positionX;
                let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                let objectTop = collisionObjects[i].positionY;
                let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
                if (this === collisionObjects[i])
                    continue;
                else if (((objectLeft <= ballRight && ballRight <= objectRight) || (objectLeft <= ballLeft && ballLeft <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                    this.directionX != this.directionX;
                    break;
                }
                if ((ballRight > objectLeft && ((objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight) || (objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                } else if (ballLeft - this.speedX < 0) {
                    collision = 2;
                    computerWins++;
                    break;
                } else if (ballTop - this.speedY < 0) {
                    collision = 3;
                    break;
                }
            };
        }
        if (collision) {
            if (Math.round(Math.random())) {
                if (this.speedX < 4)
                    this.speedX += difficult + (Math.random() / 10);
            } else {
                if (this.speedY < 4)
                    this.speedY += difficult + (Math.random() / 10);
            }
            if (collision == 1) {
                this.directionX = !this.directionX;
                if (Math.round(Math.random()))
                    this.directionY = !this.directionY;
            } else if (collision == 2) {
                this.resetBall();
            } else {
                this.directionY = !this.directionY;
            }
        } else {
            if (this.directionX)
                this.positionX += this.speedX;
            else
                this.positionX -= this.speedX;
            if (this.directionY)
                this.positionY += this.speedY;
            else
                this.positionY -= this.speedY;
        }
    }
}

//variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const playerPoints = document.querySelector(".pointsPlayer");
const computerPoints = document.querySelector(".pointsComputer");
const resetButton = document.querySelector(".reset");

let numberofBalls = 1;
const addBallButton = document.querySelector(".addBall");
addBallButton.addEventListener('click', () => {
    const tempBall = new Ball;
    ballsGame.push(tempBall);
    collisionObjects.push(tempBall);
});

const removeBallButton = document.querySelector(".removeBall");
removeBallButton.addEventListener('click', () => {
    if (ballsGame.length > 2)
        ballsGame.pop();
    if (collisionObjects.length > 3)
        collisionObjects.pop();
});


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
            paddlePlayer.moveUp(ballsGame);
        else if (e.keyCode == 83)
            paddlePlayer.moveDown(ballsGame);
        if (e.keyCode == 80)
            paddleComputer.moveUp(ballsGame);
        else if (e.keyCode == 186)
            paddleComputer.moveDown(ballsGame);
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//array with all activ game elements (paddels, balls)
const collisionObjects = [];
const ballsGame = [];

//object Paddle




const ball = new Ball();

const paddlePlayer = new Paddle();
const paddleComputer = new Paddle(canvas.width - 10);

collisionObjects.push(paddlePlayer, paddleComputer, ball);
ballsGame.push(ball);
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
    // paddleComputer.autoMove(collisionObjects);
    ballsMove(ballsGame);
    // paddlePlayer.autoMove(collisionObjects);
    paddleComputer.autoMove(ballsGame);
    drawObject(collisionObjects, ctx);
    updateScore();
    // if (playerWins > 9 || computerWins > 9)
    //     clearInterval(timer);0

}

let timer = setInterval(run, 1000 / 50);