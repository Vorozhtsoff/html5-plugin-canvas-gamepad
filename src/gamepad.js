/* eslint-disable no-use-before-define */
import importedFont from './font';

let bit = importedFont;


let canvas = null;
let ctx;

const width = window.innerWidth;
const height = window.innerHeight;

/*
** @param scale {array}
*/
const scale = [
    (window.innerWidth / width),
    (window.innerHeight / height)
];

let touches = {};
const map = {};

/*
** @param toggle {boolean}
*/
let toggle = false;

/*
** @param ready {boolean}
*/
let ready = false;

/*
** @param hint {boolean}
*/
const hint = false;

/*
* @param debug {boolean}
*/
const debug = false;
/*
** @param debug {boolean}
*/
const trace = false;

/*
** @param hidden {boolean}
*/
const hidden = false;

/*
** @param position {string}
** @description
** TOP_LEFT | TOP_RIGHT | BOTTOM_LEFT | BOTTOM_RIGHT
*/
let layout = 'BOTTOM_RIGHT';


/*
    ** @param radius {int}
    */
const radius = 25;

/*
** @param opacity {float} (0.0 -> 1.0)
** @description opacity
*/
const opacity = 0.4;

/*
** @param colors {object}
** @description color collection used in app in rgba format
*/
const colors = {
    red: `rgba(255,0,0,${opacity})`,
    green: `rgba(0,255,0,${opacity})`,
    blue: `rgba(0,0,255,${opacity})`,
    purple: `rgba(255,0,255,${opacity})`,
    yellow: `rgba(255,255,0,${opacity})`,
    cyan: `rgba(0,255,255,${opacity})`,
    black: `rgba(0,0,0,${opacity})`,
    white: `rgba(255,255,255,${opacity})`,
    joystick: {
        base: `rgba(0,0,0,${opacity})`,
        dust: `rgba(0,0,0,${opacity})`,
        stick: 'rgba(204,204,204,1)',
        ball: 'rgba(255,255,255,1)'
    }
};

/*
** @param buttons {int}
*/
let buttons = 0;

/*
** @param buttonsLayout {array}
*/
let buttonsLayout = [
    [{
        x: 0,
        y: 0,
        r: radius,
        color: colors.red,
        name: 'a'
    }],
    [
        {
            x: -(radius / 4),
            y: radius + (radius / 2),
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: (radius + (radius / 0.75)),
            y: -radius + (radius / 2),
            r: radius,
            color: colors.green,
            name: 'b'
        }
    ],
    [
        {
            x: -radius * 0.75,
            y: radius * 2,
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: radius * 1.75,
            y: radius,
            r: radius,
            color: colors.green,
            name: 'b'
        },
        {
            x: radius * 3.5,
            y: -radius,
            r: radius,
            color: colors.blue,
            name: 'c'
        }
    ],
    [
        {
            x: -radius,
            y: radius,
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: (radius * 2) - radius,
            y: -(radius + (radius)) + radius,
            r: radius,
            color: colors.green,
            name: 'b'
        },
        {
            x: (radius * 2) - radius,
            y: (radius + radius) + radius,
            r: radius,
            color: colors.blue,
            name: 'x'
        },
        {
            x: radius * 3,
            y: 0 + radius,
            r: radius,
            color: colors.purple,
            name: 'y'
        }
    ]
];
/*
** @param buttonLayout {object}
*/
const buttonLayout = { x: (radius * 3), y: (radius * 3) };
/*
** @param buttonsLayoutBuilt {boolean}
*/
let buttonsLayoutBuilt = false;

/*
** @param start {boolean}
*/
const start = true;
const startButton = {
    x: width / 2, y: -15, w: 50, h: 15, color: colors.black, name: 'start'
};

/*
** @param start {boolean}
*/
const select = false;
const selectButton = {
    x: width / 2, y: -15, w: 50, h: 15, color: colors.black, name: 'select'
};

/*
** @param hidden {boolean}
*/
const joystick = true;

const stage = {
    create(id = 'CanvasGamepad') {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', id);
        document.body.appendChild(canvas);
        stage.assign(id);
    },
    assign(id) {
        if (!document.getElementById(id)) {
            stage.create(id);
        }
        canvas = document.getElementById(id);
        stage.adjust();
    },
    adjust() {
        ctx = canvas.getContext('2d');
        ctx.canvas.width = width * scale[0];
        ctx.canvas.height = height * scale[1];
        ctx.scale(scale[0], scale[1]);
    }
};

function css() {
    const style = document.createElement('style');
    style.innerHTML = `${''
        + '\n@font-face {'
        + "\n\t\tfont-family: 'bit';"
    + '\n\t\tsrc: url('}${bit}) format('truetype');`
    + '\n\t\tfont-weight: normal;'
    + '\n\t\tfont-style: normal;'
        + '}'
        + '\n'
    + '* {'
    + '\n\t\tpadding: 0;'
    + '\n\t\tmargin: 0;'
    + '\n\t\t-webkit-touch-callout: none;'
    + '\n\t\t-webkit-user-select: none;'
    + '}'
    + '\n'
    + 'html'
    + '{'
    + '\n\t\t-ms-touch-action: manipulation;'
    + '\n\t\ttouch-action: manipulation;'
    + '\n}'
    + '\n\n'
    + 'body'
    + '{'
    + '\n\t\twidth:  100%;'
    + '\n\t\theight: 100%;'
    + '\n\t\tmargin: 0px;  '
    + '\n\t\tpadding:0px; '
    + '\n\t\ttouch-action: none;'
    + '\n\t\t-ms-touch-action: none;'
    + '\n\t\toverflow: hidden;'
    + '\n}'
    + '\n'
    + 'canvas'
    + '{'
    + '\n\t\timage-rendering: optimizeSpeed;'
    + '\n\t\timage-rendering: -moz-crisp-edges;'
    + '\n\t\timage-rendering: -webkit-optimize-contrast;'
    + '\n\t\timage-rendering: -o-crisp-edges;'
    + '\n\t\timage-rendering: crisp-edges;'
    + '\n\t\t-ms-interpolation-mode: nearest-neighbor;'
    + '\n\t\t touch-action-delay: none;'
    + '\n\t\ttouch-action: none;'
    + '\n\t\t-ms-touch-action: none;'
    + '\n\t\tposition:fixed;'
    + '\n}'
    + '\n';
    document.head.appendChild(style);

    bit = {
        button: "18px 'bit'",
        small: "12px 'bit'",
        medium: "16px 'bit'",
        large: "24px 'bit'",
        huge: "48px 'bit'"
    };
}

const controller = {
    init() {
        const layoutString = layout;
        let shift = null;
        layout = { x: 0, y: 0 };
        switch (layoutString) {
            case 'TOP_LEFT':
                shift = 0;
                buttonsLayout.forEach((button) => {
                    if (button.r) {
                        shift += button.r;
                        button.y -= button.r * 2; // eslint-disable-line no-param-reassign
                    }
                });
                layout.x = shift + buttonLayout.x;
                layout.y = 0 + buttonLayout.y;
                break;
            case 'TOP_RIGHT':
                layout.x = width - buttonLayout.x;
                layout.y = 0 + buttonLayout.y;
                break;
            case 'BOTTOM_LEFT':
                shift = 0;
                buttonsLayout.forEach((button) => {
                    if (button.r) {
                        shift += button.r;
                    }
                });
                layout.x = shift + buttonLayout.x;
                layout.y = height - buttonLayout.y;
                break;
            case 'BOTTOM_RIGHT':
                layout.x = width - buttonLayout.x;
                layout.y = height - buttonLayout.y;
                break;
            default: break;
        }

        controller.buttons.init();
        if (joystick) { controller.stick.init(); }
    },
    buttons: {
        init() {
            let x;
            let y;
            for (let n = 0; n < buttonsLayout.length; n += 1) {
                const button = buttonsLayout[n];
                x = layout.x - button.x;
                y = layout.y - button.y;
                const { r } = button;
                if (r) {
                    buttonsLayout[n].hit = {
                        x: [x - r, x + (r * 2)],
                        y: [y - r, y + (r * 2)],
                        active: false
                    };
                } else {
                    button.x = (width / 2) - button.w;
                    if (start && select) {
                        switch (button.name) {
                            case 'select':
                                button.x = (width / 2) - button.w - (button.h * 2);
                                break;
                            case 'start':
                                button.x = width / 2;
                                break;
                            default: break;
                        }
                    }
                    x = button.x; // eslint-disable-line prefer-destructuring
                    y = layout.y - button.y;
                    buttonsLayout[n].hit = {
                        x: [x, x + button.w],
                        y: [y, y + button.h],
                        active: false
                    };
                }
                map[button.name] = 0;
            }
        },
        draw() {
            for (let n = 0; n < buttonsLayout.length; n += 1) {
                const button = buttonsLayout[n];
                const { color } = button;

                let x = layout.x - button.x;
                let y = layout.y - button.y;
                let w;
                button.dx = x;
                button.dy = y;

                let { r } = button;
                if (r) {
                    if (button.hit) {
                        if (button.hit.active) {
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(x, y, r + 5, 0, 2 * Math.PI, false);
                            ctx.fill();
                            ctx.closePath();
                        }
                    }

                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = bit.button;
                    ctx.fillText(button.name, x, y);
                } else {
                    const { h } = button;
                    w = button.w; // eslint-disable-line prefer-destructuring
                    x = button.x; // eslint-disable-line prefer-destructuring
                    y = button.dy;
                    r = 10;
                    ctx.fillStyle = color;
                    if (button.hit) {
                        if (button.hit.active) {
                            ctx.roundRect(x - 5, y - 5, w + 10, h + 10, r * 2).fill();
                        }
                    }
                    ctx.roundRect(x, y, w, h, r).fill();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = bit.button;
                    ctx.fillText(button.name, x + (w / 2), y + (h * 2));
                }

                if (button.key && hint) {
                    ctx.fillStyle = 'rgba(0,0,0,0.25)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = bit.button;
                    if (button.name === 'start' || button.name === 'select') {
                        x += w / 2;
                    }
                    ctx.fillText(button.key, x, y - (r * 1.5));
                }
            }
        },
        state(id, n, type) {
            if (touches[id].id !== 'stick') {
                const touch = {
                    x: touches[id].x,
                    y: touches[id].y
                };
                const button = buttonsLayout[n];
                const { name } = button;

                const dx = parseInt(touch.x - button.dx, 10);
                const dy = parseInt(touch.y - button.dy, 10);
                let dist = width;
                if (button.r) {
                    dist = parseInt(Math.sqrt((dx * dx) + (dy * dy)), 10);
                } else if (
                    touch.x > button.hit.x[0] &&
                    touch.x < button.hit.x[1] &&
                    touch.y > button.hit.y[0] &&
                    touch.y < button.hit.y[1]
                ) {
                    dist = 0;
                }
                if (dist < radius && touches[id].id !== 'stick') {
                    if (!type) {
                        touches[id].id = name;
                    } else {
                        switch (type) {
                            case 'mousedown':
                                touches[id].id = name;
                                break;
                            case 'mouseup':
                                delete touches[id].id;
                                controller.buttons.reset(n);
                                break;
                            default: break;
                        }
                    }
                }
                if (touches[id].id === name) {
                    map[name] = 1;
                    button.hit.active = true;
                    if (dist > radius) {
                        button.hit.active = false;
                        map[name] = 0;
                        delete touches[id].id;
                    }
                }
            }
        },
        reset(n) {
            const button = buttonsLayout[n];
            const { name } = button;
            button.hit.active = false;
            map[name] = 0;
        }
    },
    stick: {
        radius: 40,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        init() {
            this.radius = 40;
            this.x = (width) - (layout.x);
            this.y = layout.y;
            this.dx = this.x;
            this.dy = this.y;
            map['x-dir'] = 0;
            map['y-dir'] = 0;
            map['x-axis'] = 0;
            map['y-axis'] = 0;
        },
        draw() {
            ctx.fillStyle = colors.joystick.base;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = colors.joystick.dust;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = colors.joystick.stick;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = colors.joystick.ball;
            ctx.beginPath();
            ctx.arc(this.dx, this.dy, this.radius - 10, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        },
        state(id, type) {
            const touch = {
                x: touches[id].x,
                y: touches[id].y
            };
            const dx = parseInt(touch.x - this.x, 10);
            const dy = parseInt(touch.y - this.y, 10);
            const dist = parseInt(Math.sqrt((dx * dx) + (dy * dy)), 10);
            if (dist < (this.radius * 1.5)) {
                if (!type) {
                    touches[id].id = 'stick';
                } else {
                    switch (type) {
                        case 'mousedown':
                            touches[id].id = 'stick';
                            break;
                        case 'mouseup':
                            delete touches[id].id;
                            controller.stick.reset();
                            break;
                        default: break;
                    }
                }
            }
            if (touches[id].id === 'stick') {
                if (Math.abs(parseInt(dx, 10)) < (this.radius / 2)) { this.dx = this.x + dx; }
                if (Math.abs(parseInt(dy, 10)) < (this.radius / 2)) { this.dy = this.y + dy; }
                map['x-axis'] = (this.dx - this.x) / (this.radius / 2);
                map['y-axis'] = (this.dy - this.y) / (this.radius / 2);
                map['x-dir'] = Math.round(map['x-axis']);
                map['y-dir'] = Math.round(map['y-axis']);

                if (dist > (this.radius * 1.5)) {
                    controller.stick.reset();
                    delete touches[id].id;
                }
            }
        },
        reset() {
            this.dx = this.x;
            this.dy = this.y;
            map['x-dir'] = 0;
            map['y-dir'] = 0;
            map['x-axis'] = 0;
            map['y-axis'] = 0;
        }
    }
};

function init() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = bit.small;
    ctx.fillText('loading', width / 2, height / 2);
    if (joystick) { controller.stick.draw(); }
    controller.buttons.draw();
    setTimeout(() => { ready = true; }, 250);
}

function setup(config) {
    const { length } = Object.keys(config);
    document.addEventListener('touchmove', (e) => { e.preventDefault(); }, false);
    css();

    if (length) {
        stage[config.canvas ? 'assign' : 'create'](config.canvas);
        Object.entries(config).forEach(([key, value]) => {
            switch (key) {
                case 'debug':
                case 'trace':
                case 'layout':
                case 'start':
                case 'select':
                case 'hidden':
                case 'joystick':
                case 'hint': break;
                case 'buttons':
                    buttons = value.length - 1;
                    if (value.length > buttonsLayout.length) {
                        buttons = buttonsLayout.length - 1;
                    }
                    buttonsLayout = buttonsLayout[buttons];
                    value.forEach(({ name, color, key: btnKey }, index) => {
                        if (name) {
                            buttonsLayout[index].name = name;
                        }
                        if (color) {
                            buttonsLayout[index].color = color;
                        }

                        if (key) {
                            buttonsLayout[index].key = btnKey;
                        }
                        buttonsLayoutBuilt = true;
                    });
                    break;
                default: break;
            }
        });
    } else {
        stage.create();
    }
    if (!buttonsLayoutBuilt) {
        buttonsLayout = buttonsLayout[buttons];
    }

    if (start) { buttonsLayout.push(startButton); }
    if (select) { buttonsLayout.push(selectButton); }

    events.bind();
    controller.init();
    init();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!hidden) {
        if (debug) { helper.debug(); }
        if (trace) { helper.trace(); }
        if (joystick) { controller.stick.draw(); }
        controller.buttons.draw();
    }
}

const events = {
    bind() {
        const eventNames = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'];
        eventNames.forEach(eventName => canvas.addEventListener(eventName, CanvasGamepad.events));
    },
    listen(event) {
        let e = event;
        const eventType = e.type;
        let id;
        if (eventType) {
            if (eventType.includes('mouse')) {
                e.identifier = 'desktop';
                e = { touches: [e] };
            }
            for (let n = 0; n < (e.touches.length > 5 ? 5 : e.touches.length); n += 1) {
                id = e.touches[n].identifier;
                if (!touches[id]) {
                    touches[id] = {
                        x: e.touches[n].pageX,
                        y: e.touches[n].pageY
                    };
                } else {
                    touches[id].x = e.touches[n].pageX;
                    touches[id].y = e.touches[n].pageY;
                }
            }
            Object.keys(touches).forEach((i) => {
                switch (eventType) {
                    case 'touchstart':
                    case 'touchmove':
                        controller.stick.state(i);
                        buttonsLayout.forEach((ns, idx) => controller.buttons.state(i, idx));
                        break;
                    case 'mousedown':
                    case 'mousemove':
                    case 'mouseup':
                        controller.stick.state(i, eventType);
                        buttonsLayout.forEach((ns, idx) => (
                            controller.buttons.state(i, idx, eventType)
                        ));
                        break;
                    default: break;
                }
            });

            /*
            ** @description remove touchend from touches
            */
            if (e.type === 'touchend') {
                id = e.changedTouches[0].identifier;
                if (touches[id].id === 'stick') {
                    controller.stick.reset();
                }
                for (let n = 0; n < buttonsLayout.length; n += 1) {
                    if (touches[id].id === buttonsLayout[n].name) {
                        controller.buttons.reset(n);
                    }
                }
                if (touches[id]) { delete touches[id]; }

                if (e.changedTouches.length > e.touches.length) {
                    let length = 0;
                    const delta = e.changedTouches.length - e.touches.length;
                    Object.entries(touches).forEach(([key]) => {
                        if (length >= delta) {
                            delete touches[key];
                        }
                        length += 1;
                    });
                }
                if (e.touches.length === 0) {
                    touches = {};
                    for (let n = 0; n < buttonsLayout.length; n += 1) {
                        controller.buttons.reset(n);
                    }
                    controller.stick.reset();
                }
            }
        } else {
            const keys = e;
            let dir = 0;
            Object.entries(keys).forEach(([prop]) => {
                switch (prop) {
                    case '%':// left
                        if (keys[prop]) { dir += 1; }
                        break;
                    case '&':// up
                        if (keys[prop]) { dir += 2; }
                        break;
                    case "'":// right
                        if (keys[prop]) { dir += 4; }
                        break;
                    case '(':// down
                        if (keys[prop]) { dir += 8; }
                        break;
                    default:
                        if (keys[prop]) {
                            for (let n = 0; n < buttonsLayout.length; n += 1) {
                                if (buttonsLayout[n].key) {
                                    if (buttonsLayout[n].key === prop) {
                                        touches[buttonsLayout[n].name] = {
                                            id: buttonsLayout[n].name,
                                            x: buttonsLayout[n].hit.x[0] + (buttonsLayout[n].w / 2),
                                            y: buttonsLayout[n].hit.y[0] + (buttonsLayout[n].h / 2)
                                        };
                                        controller.buttons.state(buttonsLayout[n].name, n, 'mousedown');
                                    }
                                }
                            }
                        } else if (!keys[prop]) {
                            for (let n = 0; n < buttonsLayout.length; n += 1) {
                                if (buttonsLayout[n].key) {
                                    if (buttonsLayout[n].key === prop) {
                                        controller.buttons.reset(n);
                                        delete touches[buttonsLayout[n].name];
                                    }
                                }
                            }
                            delete keys[prop];
                        }
                        break;
                }
                controller.stick.dx = controller.stick.x;
                controller.stick.dy = controller.stick.y;
                switch (dir) {
                    case 1:// left
                        controller.stick.dx = controller.stick.x - (controller.stick.radius / 2);
                        break;
                    case 2:// up
                        controller.stick.dy = controller.stick.y - (controller.stick.radius / 2);
                        break;
                    case 3:// left up
                        controller.stick.dx = controller.stick.x - (controller.stick.radius / 2);
                        controller.stick.dy = controller.stick.y - (controller.stick.radius / 2);
                        break;
                    case 4:// right
                        controller.stick.dx = controller.stick.x + (controller.stick.radius / 2);
                        break;
                    case 6:// right up
                        controller.stick.dx = controller.stick.x + (controller.stick.radius / 2);
                        controller.stick.dy = controller.stick.y - (controller.stick.radius / 2);
                        break;
                    case 8:// down
                        controller.stick.dy = controller.stick.y + (controller.stick.radius / 2);
                        break;
                    case 9:// left down
                        controller.stick.dx = controller.stick.x - (controller.stick.radius / 2);
                        controller.stick.dy = controller.stick.y + (controller.stick.radius / 2);
                        break;
                    case 12:// right down
                        controller.stick.dx = controller.stick.x + (controller.stick.radius / 2);
                        controller.stick.dy = controller.stick.y + (controller.stick.radius / 2);
                        break;
                    default:
                        controller.stick.dx = controller.stick.x;
                        controller.stick.dy = controller.stick.y;
                        break;
                }
                if (dir !== 0) {
                    touches.stick = { id: 'stick' };
                    controller.stick.state('stick', 'mousemove');
                } else {
                    controller.stick.reset();
                    delete touches.stick;
                }
            });
        }

        return events.broadcast();
    },
    broadcast() {
        return map;
    },
    observe() {
        return events.broadcast();
    }
};

let helper = {
    debug() {
        let dy = 15;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = bit.medium;
        ctx.fillText('debug', 10, dy);
        ctx.font = bit.small;
        dy += 5;
        Object.keys(touches).forEach((prop) => {
            dy += 10;
            const text = `${prop} : ${JSON.stringify(touches[prop]).slice(1, -1)}`;
            ctx.fillText(text, 10, dy);
        });
    },
    trace() {
        let dy = 15;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = bit.medium;
        ctx.fillText('trace', width - 10, dy);
        ctx.font = bit.small;
        dy += 5;
        Object.keys(map).forEach((prop) => {
            dy += 10;
            const text = `${prop} : ${map[prop]}`;

            ctx.fillText(text, width - 10, dy);
        });
    }
};

(function loop() {
    toggle = !toggle;
    if (toggle) {
        window.requestAnimationFrame(loop);
        return;
    }
    if (ready) { draw(); }
    window.requestAnimationFrame(loop);
}());

window.CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, w, h, r) {
    let rad;
    if (w < 2 * r) {
        rad = w / 2;
    }
    if (h < 2 * r) {
        rad = h / 2;
    }

    this.beginPath();
    this.moveTo(x + rad, y);
    this.arcTo(x + w, y, x + w, y + h, rad);
    this.arcTo(x + w, y + h, x, y + h, rad);
    this.arcTo(x, y + h, x, y, rad);
    this.arcTo(x, y, x + w, y, rad);
    this.closePath();
    return this;
};

const CanvasGamepad = {
    setup,
    draw,
    events: e => events.listen(e),
    observe: () => events.observe()
};

export default CanvasGamepad;
