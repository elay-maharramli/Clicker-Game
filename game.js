const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const CANVAS2_WIDTH = 470;
const CANVAS2_HEIGHT = 250;

const SHOTEFFECT_WIDTH = 50;
const SHOTEFFECT_HEIGHT = 50;

const TANK_WIDTH = 400;
const TANK_HEIGHT = 260;

const ROCKET_MINI_WIDTH = 79;
const ROCKET_MINI_HEIGHT = 69;

const ROCKET_WIDTH = 100;
const ROCKET_HEIGHT = 70;

const TANK_X = 40;
const TANK_Y = -10;

canvas = document.getElementById("canvas");
canvas2 = document.getElementById("canvas2");
ctx = canvas2.getContext("2d");
ctx2 = canvas.getContext("2d");
canvas2.addEventListener("click", (e) => {
    game._enemyUpdate(20);
    Helper.playSound(game.shotSound);
    game.shot_effect.push(
        new ShotEffect(
            Helper.getRandomInt(50, CANVAS2_WIDTH - SHOTEFFECT_WIDTH),
            Helper.getRandomInt(0, CANVAS2_HEIGHT - SHOTEFFECT_HEIGHT),
            ctx
        ));
});

document.addEventListener("keydown", keyPush);
function keyPush()
{
    if (event.keyCode === 49)
    {
        if (game.money >= game.rocketPrice)
        {
            game.rockets.push(
                new Rocket(
                    CANVAS2_WIDTH,
                    -75,
                    game.xspeed += 0.1,
                    game.yspeed += 0.1,
                    game.ctx
                ));
            game._buyUpdate(game.rocketPrice);
        }
    }
}


class Helper
{
    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    static _timestamp()
    {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    /*
    Delete an element from an array without
    having to create a new array in the process
    to keep garbage collection at a minimum
    */
    static removeIndex(array, index)
    {
        if (index >= array.length || array.length <= 0)
        {
            return;
        }

        array[index] = array[array.length - 1];
        array[array.length - 1] = undefined;
        array.length = array.length - 1;
    }

    static playSound(sound)
    {
        sound.pause();
        sound.currentTime = 0;
        sound.play().then(() => {}).catch(() => {})
    }
}

class CanvasStroke
{
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.ctx = context;
    }

    update()
    {
    }

    draw()
    {
        ctx.rect(this.x, this.y, CANVAS2_WIDTH, CANVAS2_HEIGHT);
        ctx.stroke();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 7;
    }
}


class ShotEffect
{
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = SHOTEFFECT_WIDTH;
        this.h = SHOTEFFECT_HEIGHT;
        this.img = new Image();
        this.img.src = "img/shot_effect.png";
        this.ctx = context;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        );
    }
}

class Rocket
{
    constructor(x, y, dx, dy, context) {
        this.x = x;
        this.y = y;
        this.w = ROCKET_WIDTH;
        this.h = ROCKET_HEIGHT;
        this.dx = dx;
        this.dy = dy;
        this.ctx = context;
        this.img = new Image();
        this.img.src = "img/rocket.png"
    }

    update()
    {
        this.x -= this.dx;
        this.y += this.dy;
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        );
    }
}

/*
class Tank {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = TANK_WIDTH;
        this.h = TANK_HEIGHT;
        this.img = new Image();
        this.img.src = "img/tank.png";
        this.ctx = context;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h,
        );
    }
}
*/
class Game
{
    constructor(context)
    {
        this.fps = 60;
        this.step = 1 / this.fps;
        this.now = 0;
        this.lastTime = Helper._timestamp();
        this.deltaTime = 0;

        this.ctx = context;
        this.canvasstroke = new CanvasStroke(0,0,this.ctx);
        this.enemyhp = 1000;
        this.shotSound = new Audio();
        this.shotSound.src = "sound/shot.mp3";
        this.enemydownSound = new Audio();
        this.enemydownSound.src = "sound/enemydown.mp3";
        this.rocketSound = new Audio();
        this.rocketSound.src = "sound/rocketsound.wav";
        this.effectDeleteInterval = 10;
        this.effectTimer = 0;
        this.rocketMiniImg = new Image();
        this.rocketMiniImg.src = "img/rocketmini.png";
        this.tankimg = new Image();
        this.tankimg.src = "img/tank.png";
        this.shot_effect = [];
        this.rockets = [];
        this.money = 0;
        this.damage = 20;
        this.xspeed = 10;
        this.yspeed = 10;
        this.rocketPrice = 50;
        this.loop();
    }

    loop()
    {
        this.now = Helper._timestamp();
        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.lastTime) / 1000);

        while (this.deltaTime > this.step)
        {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
        }

        this.draw(this.deltaTime);
        this.lastTime = this.now;
        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.shot_effect.forEach((effect, index) => {
            if (this.effectTimer % this.effectDeleteInterval === 0)
            {
                Helper.removeIndex(this.shot_effect, index);
            }

            this.effectTimer++;
        });

        this.rockets.forEach((rocket, index) => {
            if (rocket.x <= TANK_X + 300 & rocket.y > TANK_Y + 70)
            {
                Helper.removeIndex(this.rockets, index);
                this._enemyUpdate(100);
                Helper.playSound(this.rocketSound);
            }
            rocket.update();
        });

    }

    draw()
    {
        this.ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        this.canvasstroke.draw();


        ctx2.drawImage(
            this.rocketMiniImg,
            CANVAS_WIDTH - 130, CANVAS_HEIGHT - 320,
            ROCKET_MINI_WIDTH, ROCKET_MINI_HEIGHT
        )

        this.ctx.drawImage(
            this.tankimg,
            TANK_X, TANK_Y,
            TANK_WIDTH, TANK_HEIGHT,
        );

        for (let s in this.shot_effect)
        {
            if (this.shot_effect.hasOwnProperty(s))
            {
                this.shot_effect[s].draw();
            }
        }

        for (let r in this.rockets)
        {
            if (this.rockets.hasOwnProperty(r))
            {
                this.rockets[r].draw();
            }
        }

    }

    _moneyUpdate(money)
    {
        this.money += money;
        document.getElementById("game-money").innerText = '' + this.money;
    }

    _enemyUpdate(damage)
    {
        if (this.enemyhp <= 0)
        {
            this.enemyhp =  1000;
            this._moneyUpdate(50);
            this.shotSound.pause();
            Helper.playSound(this.enemydownSound);
        }
        else{
            this.enemyhp -= damage;
            document.getElementById("enemy-hp").innerText = '' + this.enemyhp;
        }
    }

    _buyUpdate(value)
    {
        this.money -= value;
        document.getElementById("game-money").innerText = '' + this.money;
    }

}
game = new Game(ctx);
game.update();
game.draw();
