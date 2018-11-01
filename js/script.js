//#region allClasses

class Point {
    constructor(positionX = canvas.width / 2, positionY = canvas.height / 2, color = 'white') {
        this.positionX = positionX;
        this.positionY = positionY;
        this.color = color;
    }
}

class Rectangle extends Point {
    constructor(positionX, positionY, color, width = 20, height = 20) {
        super(positionX, positionY, color);
        this.width = width;
        this.height = height;
        this.middleHeight = height / 2;
    }
}

class Paddle extends Rectangle {
    constructor(positionX = 10, positionY, color, width = 20, height = 100) {
        super(positionX, positionY, color, width, height)
        this.speed = optionGame.ballSpeed;
    }
    autoMove(ballsGame) {
        let minX = canvas.width; //minimal value of distance 
        let tempMinX = canvas.width; //temprorary distance value of iteration
        let n; //number of object with the smallest distance
        for (let i = 0; i < ballsGame.length; i++) {
            if (ballsGame[i].positionX > this.positionX) {
                tempMinX = ballsGame[i].positionX - this.positionX;
            } else {
                tempMinX = this.positionX - ballsGame[i].positionX;
            }
            if (tempMinX < minX) {
                minX = tempMinX;
                n = i;
            }

        }
        if (this.positionY + this.middleHeight == ballsGame[n].positionX + ballsGame[n].middleHeight)
            return;
        else if (this.positionY + this.middleHeight < ballsGame[n].positionY + ballsGame[n].middleHeight) {
            if (this.positionY + this.height + 1 > canvas.height)
                return;
            else if (this.positionY + this.height + this.speed > canvas.height)
                this.positionY = canvas.height - this.height;
            else
                this.moveDown(ballsGame);
        } else {
            if (this.positionY - 1 < 0)
                return;
            else if (this.positionY - this.speed < 0)
                this.positionY = 0;
            else
                this.moveUp(ballsGame);
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
        this.speedY = (Math.random() * optionGame.ballSpeed).toFixed(2) * 1;
        this.directionX = true; //true -> right
        this.directionY = true; //true -> down
    }
    resetBall() {
        this.speedX = 2;
        this.speedY = (Math.random() * optionGame.ballSpeed).toFixed(2) * 1;
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
        for (let i = 0; i < collisionObjects.length; i++) {
            let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
            let objectLeft = collisionObjects[i].positionX;
            let objectTop = collisionObjects[i].positionY;
            let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;
            if (this === collisionObjects[i]) //break all instructions when it is the same object
                continue;
            else if (((objectLeft <= ballRight && ballRight <= objectRight) || (objectLeft <= ballLeft && ballLeft <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                this.directionX != this.directionX; //no collision when object is in object (on start >1 ball), only set other direction
                break;
            }
            if (this.directionX && (ballRight + this.speedX > canvas.width)) { //check collision with the end x-axis canvas
                collision = 2;
                playerWins.increasePoints();
                break;
            } else if (!this.directionX && (ballLeft - this.speedX < 0)) { //check collision with the start x-axis canvas
                collision = 2;
                computerWins.increasePoints();
                break;
            }
            if (this.directionY && (ballBottom + this.speedY > canvas.height)) { //check collision with the end y-axis canvas
                collision = 3;
                break;
            } else if (!this.directionY && (ballTop - this.speedY < 0)) { //check collision with the start y-axis canvas
                collision = 3;
                break;
            }
            if (this.directionX && this.directionY) {
                if ((ballLeft < objectRight && ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight) || (objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                }
            } else if (this.directionX && !this.directionY) {
                if ((ballLeft < objectRight && ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight) || (objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                }
            } else if (!this.directionX && this.directionY) {
                if ((ballRight > objectLeft && ((objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight) || (objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                }
            } else {
                if ((ballRight > objectLeft && ((objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight) || (objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom)))) {
                    collision = 1;
                    break;
                }
            }
        }
        if (collision) {
            if (Math.round(Math.random())) {
                if (this.speedX < 4)
                    this.speedX += difficult + (Math.random() / 10);
            } else
                this.speedY = (Math.random() * optionGame.ballSpeed).toFixed(2) * 1;
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

class scoreBoard {
    constructor() {
        let points = 0;
        this.getPoints = () => points;
        this.increasePoints = () => points++;
        this.resetPoints = () => points = 0;
    }
}
//#endregion

//#region variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const playerPoints = document.querySelector(".pointsPlayer");
const computerPoints = document.querySelector(".pointsComputer");
const resetButton = document.querySelector(".reset");
const menuGameButton = document.querySelector(".menu");
const pauseGameButton = document.querySelector(".pause");
const saveButton = document.querySelector(".save");
let activePause = true;
let activeGame = true;
let activeMouse = true;
let activeKeyboard = true;
let gameWidth;
let difficult = 0.3;
const playerWins = new scoreBoard;
const computerWins = new scoreBoard;

const optionGame = {
    paddelWidth: 20,
    paddelHeight: 100,
    paddelSpeed: 2,
    paddelColor: 'white',
    ballSize: 20,
    ballColor: 'white',
    ballSpeed: 2,
}
//#endregion variables

canvas.width = 1000;
canvas.height = 500;

const addBallButton = document.querySelector(".addBall");
addBallButton.addEventListener('click', () => {
    const tempBall = new Ball(optionGame.ballSize, optionGame.ballColor);
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
    playerWins.resetPoints();
    computerWins.resetPoints();
    ballsGame.forEach(ballGame => {
        ballGame.resetBall();
    })
    timer = setInterval(run, 1000 / 60);
});

const clearScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//function drawing object on canvas
const drawObject = (drawingObjects, context) => {
    drawingObjects.forEach(drawingObject => {
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
    playerPoints.textContent = playerWins.getPoints();
    computerPoints.textContent = computerWins.getPoints();
}

pauseGameButton.addEventListener('click', () => {
    if (activeGame)
        clearInterval(timer);
    else
        timer = setInterval(run, 1000 / 60);
    activeGame = !activeGame;
})

saveButton.addEventListener('click', () => {
    if (document.getElementById('paddelWidthInput').value != optionGame.paddelWidth) {
        optionGame.paddelWidth = document.getElementById('paddelWidthInput').value * 1;
        collisionObjects.forEach(object => {
            if (object.__proto__ === Paddle.prototype) {
                object.width = optionGame.paddelWidth;
            }
        });
        refreshGameWindow();
    }
    if (document.getElementById('paddelHeightInput').value != optionGame.paddelHeight) {
        optionGame.paddelHeight = document.getElementById('paddelHeightInput').value * 1;
        collisionObjects.forEach(object => {
            if (object.__proto__ === Paddle.prototype) {
                object.height = optionGame.paddelHeight;
                object.middleHeight = object.height / 2;
            }

        });
    }
    if (document.getElementById('paddelColorInput').value != optionGame.paddelColor) {
        optionGame.paddelColor = document.getElementById('paddelColorInput').value;
        collisionObjects.forEach(object => {
            if (object.__proto__ === Paddle.prototype)
                object.color = optionGame.paddelColor;
        });
    }
    if (document.getElementById('paddelSpeedInput').value != optionGame.paddelSpeed) {
        optionGame.paddelSpeed = document.getElementById('paddelSpeedInput').value * 1;
        collisionObjects.forEach(object => {
            if (object.__proto__ === Paddle.prototype)
                object.speed = optionGame.paddelSpeed;
        });
    };
    if (document.getElementById('ballSizeInput').value != optionGame.ballSize) {
        optionGame.ballSize = document.getElementById('ballSizeInput').value * 1;
        ballsGame.forEach(ball => ball.width = ball.height = optionGame.ballSize);
        collisionObjects.forEach(object => {
            if (object.__proto__ === Ball.prototype)
                object.width = object.height = optionGame.ballSize;
        })
    }
    if (document.getElementById('ballColorInput').value != optionGame.ballColor) {
        optionGame.ballColor = document.getElementById('ballColorInput').value;
        ballsGame.forEach(ball => ball.color = optionGame.ballColor);
        collisionObjects.forEach(object => {
            if (object.__proto__ === Ball.prototype)
                object.color = optionGame.ballColor;
        })
    };;
    if (document.getElementById('ballSpeedInput').value != optionGame.ballSpeed) {
        optionGame.ballSpeed = document.getElementById('ballSpeedInput').value * 1;
        ballsGame.forEach(ball => ball.speed = optionGame.ballSpeed);
        collisionObjects.forEach(object => {
            if (object.__proto__ === Ball.prototype)
                object.speed = optionGame.ballSpeed;
        })
    }
    document.querySelector('.menuGame').classList.toggle('active');
})

menuGameButton.addEventListener('click', () => {
    document.querySelector('.menuGame').classList.toggle('active');
    if (document.querySelector('.menuGame').classList.contains('active')) {
        document.getElementById('paddelWidthInput').value = optionGame.paddelWidth;
        document.getElementById('paddelHeightInput').value = optionGame.paddelHeight;
        document.getElementById('paddelColorInput').value = optionGame.paddelColor;
        document.getElementById('paddelSpeedInput').value = optionGame.paddelSpeed;
        document.getElementById('ballSizeInput').value = optionGame.ballSize;
        document.getElementById('ballColorInput').value = optionGame.ballColor;
        document.getElementById('ballSpeedInput').value = optionGame.ballSpeed;
    }
})

//array with all activ game elements (paddels, balls)
const collisionObjects = [];
const ballsGame = [];

const ball = new Ball();
const paddlePlayer = new Paddle();
const paddleComputer = new Paddle(canvas.width - 10);

collisionObjects.push(paddlePlayer, paddleComputer, ball);
ballsGame.push(ball);

const run = () => {
    if (!(canvas.width === gameWidth))
        refreshGameWindow();
    clearScreen();
    ballsMove(ballsGame);
    paddleComputer.autoMove(ballsGame);
    drawObject(collisionObjects, ctx);
    updateScore();
    if (playerWins.getPoints() > 9 || computerWins.getPoints() > 9)
        clearInterval(timer);
}

let timer = setInterval(run, 1000 / 50);