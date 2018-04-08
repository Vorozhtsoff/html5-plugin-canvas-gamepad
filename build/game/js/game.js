/* eslint-disable */
const game = (() => {
    const canvas = document.getElementById('game');
    let image;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    const width = 568;
    const height = 320;

    const scale = [
        // 1,
        // 1
        (window.innerWidth / width),
        (window.innerHeight / height)
    ];

    let banner = false;
    let toggle = false;
    let ready = false;

    ctx.canvas.width = width * scale[0];
    ctx.canvas.height = height * scale[1];
    ctx.scale(scale[0], scale[1]);


    function asset(src) {
        image = new Image();
        image.src = `game/img/${src}`;
        return image;
    }

    const assets = {
        background: asset('background.png'),
        character: asset('character.png')
    };

    const character = [
        [[0, 0], [32, 0], [64, 0]], // down
        [[0, 32], [32, 32], [64, 32]], // left
        [[0, 64], [32, 64], [64, 64]], // right
        [[0, 96], [32, 96], [64, 96]], // up
        [[0, 0], [32, 0], [64, 0]], // down-left
        [[0, 32], [32, 32], [64, 32]], // up-left
        [[0, 64], [32, 64], [64, 64]], // down-right
        [[0, 96], [32, 96], [64, 96]]// up-right
    ];

    const player = {
        x: 0,
        y: 0,
        r: 25,
        c: 'rgba(0,0,0,0.1)',
        d: 1,
        moving: false,
        frames: 0,
        frame: 0,
        delay: 0,
        init() {
            this.x = width / 2;
            this.y = height / 2;
        },
        draw() {
            ctx.fillStyle = this.c;
            ctx.beginPath();

            for (let i = 0; i < 2 * Math.PI; i += 0.1) {
                const x = this.x + (this.r * Math.cos(i));
                const y = this.y + (this.r / 2 * Math.sin(i)); // eslint-disable-line no-mixed-operators

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.fill();
            ctx.closePath();
            ctx.strokeStyle = this.c;
            ctx.lineWidth = 1;
            ctx.stroke();

            this.r += this.d;
            if (this.r > 30) { this.d = -0.1; }
            if (this.r < 25) { this.d = 0.1; }

            if (player.moving) {
                player.delay += 1;
                console.log(player.delay);
                player.frame = parseInt(player.delay / 5, 10);

                if (player.delay >= 14) {
                    player.delay = 0;
                }
            } else {
                player.frame = 0;
            }

            const sx = character[player.frames][player.frame][0];
            const sy = character[player.frames][player.frame][1];
            const sw = 32;
            const sh = 32;
            const w = 32;
            const h = 32;

            ctx.drawImage(
                assets.character,
                sx,
                sy,
                sw,
                sh,
                player.x - 16,
                player.y - this.r,
                w,
                h
            );
        }
    };

    function gamepad(map) {
        player.x += (map['x-axis']) * 5;
        player.y += (map['y-axis']) * 5;
        if (player.x < 0) { player.x = 0; }
        if (player.x > width) { player.x = width; }
        if (player.y < 0) { player.y = 0; }
        if (player.y > height) { player.y = height; }
        if (map.a === 1) { player.c = 'rgba(255,0,0,0.25)'; }
        if (map.b === 1) { player.c = 'rgba(0,255,0,0.25)'; }
        if (map.x === 1) { player.c = 'rgba(0,0,255,0.25)'; }
        if (map.y === 1) { player.c = 'rgba(255,0,255,0.25)'; }

        if (map.start === 1 && !banner) {
            banner = true;
        }
        if (map.select === 1 && banner) {
            banner = false;
        }

        const x = parseInt(map['x-dir'], 10);
        const y = parseInt(map['y-dir'], 10);
        if (x === 0 && y === 0) { player.moving = false; player.frames = 0; }
        if (x === -1 && y === 0) { player.moving = true; player.frames = 1; }
        if (x === 1 && y === 0) { player.moving = true; player.frames = 2; }
        if (x === 0 && y === -1) { player.moving = true; player.frames = 3; }
        if (x === 0 && y === 1) { player.moving = true; player.frames = 0; }
        if (x === -1 && y === 1) { player.moving = true; player.frames = 4; }
        if (x === -1 && y === -1) { player.moving = true; player.frames = 5; }
        if (x === 1 && y === 1) { player.moving = true; player.frames = 6; }
        if (x === 1 && y === -1) { player.moving = true; player.frames = 7; }
    }

    function init() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(assets.background, 0, 0, width, height);
        player.init();
        setTimeout(() => { ready = true; }, 250);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(assets.background, 0, 0, width, height);
        canvas.style.backgroundColor = 'rgba(0,0,0,0.1)';
        player.draw();
        if (CanvasGamepad) {
            gamepad(CanvasGamepad.observe());
        }
    }

    (function loop() {
        toggle = !toggle;
        if (toggle) {
            requestAnimationFrame(loop);
            return;
        }
        if (ready) { draw(); }
        requestAnimationFrame(loop);
    }());

    return {
        init,
        gamepad
    };
})();


if (
    window.navigator.userAgent.indexOf('Firefox') !== -1 ||
	window.navigator.userAgent.indexOf('Chrome') !== -1
) {
    game.init();
}
