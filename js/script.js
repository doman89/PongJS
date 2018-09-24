const canvas = document.querySelector(`canvas`);
const ctx = canvas.getContext(`2d`);

canvas.width = 1000;
canvas.height = 500;

const clearScreen = () => {
    ctx.fillStyle = `lightgrey`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Paddle(width, height, color, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.middleHeight = this.height / 2;
    this.middleWidth = this.width / 2;

    this.moveUp = (speed) => {
        if (this.positionY - speed > 0)
            this.positionY -= speed;
    };

    this.moveDown = (speed) => {
        if (this.positionY + speed + this.height < canvas.height)
            this.positionY += speed;
    };
};

let paddlePlayer = new Paddle(10, 50, `green`, 10, 10);
const paddleComputer = new Paddle(10, 50, `red`, canvas.width - 20, 10);

const drawObject = (drawingObject, context) => {
    context.fillStyle = drawingObject.color;
    context.fillRect(drawingObject.positionX, drawingObject.positionY, drawingObject.width, drawingObject.height);
}

const run = () => {
    clearScreen();
    paddleComputer.moveDown(10);
    drawObject(paddlePlayer, ctx);
    drawObject(paddleComputer, ctx);
}

setInterval(run, 1000 / 60);