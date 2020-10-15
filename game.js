const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const CANVAS2_WIDTH = 500;
const CANVAS2_HEIGHT = 280;

const SHOTEFFECT_WIDTH = 50;
const SHOTEFFECT_HEIGHT = 50;

const TANK_WIDTH = 400;
const TANK_HEIGHT = 260;

canvas = document.getElementById("canvas");
canvas2 = document.getElementById("canvas2");
ctx = canvas2.getContext("2d");

canvas2.addEventListener("click", (e) => {
    game._enemyUpdate(2);
    Helper.playSound(game.shotSound);
    game.shot_effect.push(
        new ShotEffect(
            Helper.getRandomInt(50, CANVAS2_WIDTH - SHOTEFFECT_WIDTH),
            Helper.getRandomInt(0, CANVAS2_HEIGHT - SHOTEFFECT_HEIGHT),
            ctx
        ));
});

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

class Game
{
    constructor(context)
    {
        this.ctx = context;
        this.tank = new Tank(90,0,this.ctx);
        this.enemyhp = 100;
        this.hp = 100;
        this.shotSound = new Audio();
        this.shotSound.src = "sound/shot.mp3";
        this.effectDeleteInterval = 30;
        this.effectTimer = 1;
        this.shot_effect = []
        this.money = 0;
        this.damage = 2;
        this.loop();
    }

    loop()
    {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.tank.update();

        this.shot_effect.forEach((effect, index) => {
            if (this.effectTimer % this.effectDeleteInterval === 0)
            {
                Helper.removeIndex(this.shot_effect, index);
            }

        });
        this.effectTimer++;

    }

    draw()
    {
        this.ctx.clearRect(0,0,CANVAS2_WIDTH,CANVAS2_HEIGHT);
        this.tank.draw();
        for (let e in this.shot_effect)
        {
            if (this.shot_effect.hasOwnProperty(e))
            {
                this.shot_effect[e].draw();
            }
        }
    }

    _moneyUpdate(money)
    {
        this.money += money;
        document.getElementById("game-money").innerText = '' + this.money;
    }

    _enemyUpdate()
    {
        if (this.enemyhp === 0)
        {
            this.enemyhp = 100;
            this._moneyUpdate(20);
        }
        else{
            this.enemyhp -= this.damage;
            document.getElementById("enemy-hp").innerText = '' + this.enemyhp;
        }
    }
}
game = new Game(ctx);
game.update();
game.draw();