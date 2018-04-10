/* eslint-disable no-use-before-define */
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { appendCss } from './utils/css';
import bit from './config/button-size';
import colors from './config/colors';
import getWindowSize from './utils/get-window-size';
import getButtonsLayouts from './config/buttons-layouts';
import roundReact from './utils/round-react';
import { toDec, toInt } from '../utils/math';
import drawStick from './draw/stick';
import {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
} from './consts';
import { drawDebug, drawTrace } from './helpers';

const { width, height } = getWindowSize();

const scale = [1, 1];

let touches = {};
const map = {};

let toggle = false;
let ready = false;
const hint = false;
const debug = true;
const trace = true;
const hidden = false;
const radius = 25;
let hasLeftStick = true;
let hasRightStick = false;
const layout = { x: 0, y: 0 };
const layoutString = BOTTOM_RIGHT;
const noop = () => null;

const handlers = {
    onLeftStick: noop,
    onRightStick: noop,
    onStartButton: noop,
    onSelectButton: noop,
    onStateChanges: noop
};

const state = {
    hasStartButton: true,
    hasSelectButton: true,
    startButtonDefault: {
        x: (width / 2),
        y: -15,
        w: 50,
        h: 15,
        color: colors.black,
        name: 'start'
    },
    selectButtonDefault: {
        x: (width / 2),
        y: -15,
        w: 50,
        h: 15,
        color: colors.black,
        name: 'select'
    },
    startButton: null,
    selectButton: null
};

const defaultButtonsLoyaout = getButtonsLayouts(radius, colors);
let buttonsLayout;

const buttonLayout = { x: (radius * 3), y: (radius * 3) };


const stage = {
    canvas: null,
    ctx: null,
    create(id) {
        let element;
        if (id) {
            element = document.getElementById(id);
        }

        if (!element) {
            this.createCanvas(id);
        }

        this.adjust();
    },
    createCanvas(id = 'CanvasGamepad') {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', id);
        document.body.appendChild(this.canvas);
    },
    adjust() {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = width * scale[0];
        this.ctx.canvas.height = height * scale[1];
        this.ctx.scale(scale[0], scale[1]);
    }
};


const controller = {
    init() {
        let shift = null;
        switch (layoutString) {
            case TOP_LEFT:
                shift = 0;
                buttonsLayout.forEach((button) => {
                    if (button.r) {
                        shift += button.r;
                        button.y -= button.r * 2; // eslint-disable-line no-param-reassign
                    }
                });
                layout.x = shift + buttonLayout.x;
                layout.y = +buttonLayout.y;
                break;
            case TOP_RIGHT:
                layout.x = width - buttonLayout.x;
                layout.y = +buttonLayout.y;
                break;
            case BOTTOM_LEFT:
                shift = 0;
                buttonsLayout.forEach((button) => {
                    if (button.r) {
                        shift += button.r;
                    }
                });
                layout.x = shift + buttonLayout.x;
                layout.y = height - buttonLayout.y;
                break;
            case BOTTOM_RIGHT:
                layout.x = width - buttonLayout.x;
                layout.y = height - buttonLayout.y;
                break;
            default: break;
        }

        controller.buttons.init();

        if (hasLeftStick) {
            controller.stick.init();
        }

        if (hasRightStick) {
            controller.rightStick.init();
        }
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
                    const { hasStartButton, hasSelectButton } = state;
                    button.x = (width / 2) - button.w;

                    if (hasStartButton && hasSelectButton) {
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
        draw(ctx) {
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

                const dx = touch.x - button.dx;
                const dy = touch.y - button.dy;
                let dist = width;
                if (button.r) {
                    dist = toDec(Math.sqrt((dx ** 2) + (dy ** 2)));
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
    rightStick: {
        X_DIR: 'RIGHT_STICK_X_DIR',
        Y_DIR: 'RIGHT_STICK_Y_DIR',
        X_AXIS: 'RIGHT_STICK_X_AXIS',
        Y_AXIS: 'RIGHT_STICK_Y_AXIS',
        radius: 40,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        init() {
            this.radius = 40;
            this.x = width - (width - layout.x);
            this.y = layout.y;
            this.dx = this.x;
            this.dy = this.y;
            map[this.X_DIR] = 0;
            map[this.Y_DIR] = 0;
            map[this.X_AXIS] = 0;
            map[this.Y_AXIS] = 0;
        },
        draw(ctx) {
            drawStick({
                ctx,
                x: this.x,
                y: this.y,
                radius: this.radius,
                dx: this.dx,
                dy: this.dy,
                colors: colors.joystick
            });
        },
        state(id, type) {
            const touch = {
                x: touches[id].x,
                y: touches[id].y
            };
            const dx = touch.x - this.x;
            const dy = touch.y - this.y;
            const dist = toDec(Math.sqrt((dx * dx) + (dy * dy)));
            if (dist < (this.radius * 1.5)) {
                if (!type) {
                    touches[id].id = 'r-stick';
                } else {
                    switch (type) {
                        case 'mousedown':
                            touches[id].id = 'r-stick';
                            break;
                        case 'mouseup':
                            delete touches[id].id;
                            controller.rightStick.reset();
                            break;
                        default: break;
                    }
                }
            }
            if (touches[id].id === 'r-stick') {
                if (Math.abs(toDec(dx)) < (this.radius / 2)) { this.dx = this.x + dx; }
                if (Math.abs(toDec(dy)) < (this.radius / 2)) { this.dy = this.y + dy; }
                map[this.X_AXIS] = (this.dx - this.x) / (this.radius / 2);
                map[this.Y_AXIS] = (this.y - this.dy) / (this.radius / 2);
                map[this.X_DIR] = Math.round(map[this.X_AXIS]);
                map[this.Y_DIR] = Math.round(map[this.Y_AXIS]);

                handlers.onRightStick({ ...map });

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
    },
    stick: {
        radius: 40,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        init() {
            this.radius = 40;
            this.x = width - layout.x;
            this.y = layout.y;
            this.dx = this.x;
            this.dy = this.y;
            map['x-dir'] = 0;
            map['y-dir'] = 0;
            map['x-axis'] = 0;
            map['y-axis'] = 0;
        },
        draw(ctx) {
            drawStick({
                ctx,
                x: this.x,
                y: this.y,
                radius: this.radius,
                dx: this.dx,
                dy: this.dy,
                colors: colors.joystick
            });
        },
        state(id, type) {
            const touch = {
                x: touches[id].x,
                y: touches[id].y
            };
            const dx = touch.x - this.x;
            const dy = touch.y - this.y;
            const dist = toDec(Math.sqrt((dx * dx) + (dy * dy)));
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
                if (Math.abs(dx) < (this.radius / 2)) { this.dx = this.x + dx; }
                if (Math.abs(dy) < (this.radius / 2)) { this.dy = this.y + dy; }
                map['x-axis'] = (this.dx - this.x) / (this.radius / 2);
                map['y-axis'] = (this.y - this.dy) / (this.radius / 2);
                map['x-dir'] = toInt(map['x-axis']);
                map['y-dir'] = toInt(map['y-axis']);
                handlers.onLeftStick({ ...map });

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

function init(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = bit.small;
    ctx.fillText('loading', width / 2, height / 2);
    ready = true;
}

function prepareButtons(buttonsList, layoutsList) {
    const buttons = buttonsList.slice(0, layoutsList.length);
    const layoutType = layoutsList[buttons.length - 1];
    return buttons.map((button, index) => Object.assign({}, layoutType[index], button));
}

const preventDefault = e => e.preventDefault();

function setup({
    canvas,
    buttons,
    leftStick,
    rightStick,
    onStartButton,
    onStateChanges,
    onRightStick,
    onLeftStick,
    select,
    start
}) {
    document.addEventListener('touchmove', preventDefault);
    appendCss();

    if (buttons) {
        buttonsLayout = prepareButtons(buttons, defaultButtonsLoyaout);
    }

    if(rightStick) {
        hasRightStick = rightStick;
    }

    if(leftStick) {
        hasLeftStick = leftStick;
    }

    if (onStartButton) {
        handlers.onStartButton = onStartButton;
    }

    if (onStateChanges) {
        handlers.onStateChanges = onStateChanges;
    }

    if (onLeftStick) {
        handlers.onLeftStick = onLeftStick;
    }

    if (onRightStick) {
        handlers.onRightStick = onRightStick;
    }

    stage.create(canvas);

    if (start) {
        buttonsLayout.push(state.startButtonDefault);
    }

    if (select) {
        buttonsLayout.push(state.selectButtonDefault);
    }

    events.bind();
    controller.init();
    init(stage.ctx);
    setDefaultMap(map);
}

function draw(ctx) {
    ctx.clearRect(0, 0, stage.canvas.width, stage.canvas.height);
    if (!hidden) {
        if (debug) {
            drawDebug({
                fontSize: bit.small,
                width,
                ctx,
                map
            });
        }
        if (trace) {
            drawTrace({
                map: touches,
                ctx,
                fontSize: bit.small

            });
        }
        if (hasLeftStick) {
            controller.stick.draw(ctx);
        }

        if (hasRightStick) {
            controller.rightStick.draw(ctx);
        }

        controller.buttons.draw(ctx);
    }
}

const events = {
    bind() {
        const eventNames = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'];
        eventNames.forEach(eventName => (
            stage.canvas.addEventListener(eventName, this.listen)
        ));
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
                        controller.rightStick.state(i);
                        buttonsLayout.forEach((ns, idx) => controller.buttons.state(i, idx));
                        break;
                    case 'mousedown':
                    case 'mousemove':
                    case 'mouseup':
                        controller.stick.state(i, eventType);
                        controller.rightStick.state(i, eventType);
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
                } else if (touches[id].id === 'r-stick') {
                    controller.rightStick.reset();
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
                    controller.rightStick.reset();
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

let defaultMap = null;
const setDefaultMap = (map) => {
    defaultMap = cloneDeep(map);
};

const emitChanges = (map, cb) => {
    const newMap = cloneDeep(map);
    const isDiff = !isEqual(newMap, defaultMap);
    if (isDiff) {
        cb({ ...newMap });
    }
};

(function loop() {
    toggle = !toggle;

    if (!toggle && ready) {
        draw(stage.ctx);
        emitChanges(map, handlers.onStateChanges);
    }

    window.requestAnimationFrame(loop);
}());

window.CanvasRenderingContext2D.prototype.roundRect = roundReact;

const CanvasGamepad = {
    setup,
    draw,
    events: events.listen,
    observe: events.observe
};

export default CanvasGamepad;
