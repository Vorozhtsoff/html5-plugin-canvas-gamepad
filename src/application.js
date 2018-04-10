import io from 'socket.io-client';
import throttle from 'lodash/throttle';
import config from './config';
import auth from './auth';
import log from './utils/logger';
import { getAngle } from './utils/math';
import iterateObject from './utils/iterate-object';
import { USER_LOGIN, MOVE_PERSON, SHOT, HIT, DEAD, CHANGE_NAME, START_GAME, FINISH_GAME, GET_AREA, GET_SCENE } from './message-types';

const socket = io(config.host);
const APP_TYPE = 'phone';
let canvas;

const drawDragon = ({ position, size }) => (
    canvas.point(position.x, position.y, size, 'blue')
);

window.onload = () => {
    socket.emit(USER_LOGIN, { type: APP_TYPE, id: auth() });
    socket.on(USER_LOGIN, data => log(data));
    socket.on(GET_AREA, (data) => {
        canvas = new window.Canvas({
            area: {
                left: data.CENTER.x - data.X_SIZE / 2,
                bottom: data.CENTER.y - data.Y_SIZE / 2,
                width: data.X_SIZE,
                height: data.Y_SIZE,
                z: data.Z_SIZE
            },
            width: window.innerWidth,
            height: window.innerHeight
        });
    });

    socket.emit(START_GAME);

    socket.on(GET_SCENE, (data) => {
        const CROSS = 1;

        if (!canvas) {
            return;
        }

        canvas.clear();

        if (data.dragon) {
            drawDragon(data.dragon);
        }

        if (data.booms) {
            iterateObject(data.booms, (prop, { position, radius }) => (
                canvas.point(position.x, position.y, radius, 'black') // бум!
            ));
        }

        if (data.princess) {
            iterateObject(data.princess, (id, { position, viewDirect, size, color }) => {
                const { x, y } = position;
                canvas.line(
                    x,
                    y,
                    x + CROSS * Math.sin(viewDirect),
                    y + CROSS * Math.cos(viewDirect),
                    'rgba(0,0,0,1)',
                    1
                );

                canvas.point(x, y, size, color);
            });

            canvas.line(0.6, 2.3, 0.6, 2.3, 'red', 1);
        }

        if (data.shots) {
            iterateObject(data.shots, (prop, { position }) => (
                canvas.point(position.x, position.y, null, 'red') // выстрел!
            ));
        }
    });

    socket.on(SHOT, data => log('Выстрел!', data));
    socket.on(HIT, data => log('Попадание!', data));
    socket.on(DEAD, (data) => {
        log('Ты помер!', data);
        socket.emit(FINISH_GAME);
    });
};

const socketEmitThrottle = (action, payload, delay = 50) => throttle(socket.emit(action, payload), delay);

const getSpeed = (x, y) => Math.sqrt(x ** 2 + y ** 2) / 10;

const stopMoving = data => socket.emit(MOVE_PERSON, {
    moveDirect: getAngle(data['x-axis'], data['y-axis']),
    viewDirect: getAngle(data['x-axis'], data['y-axis']),
    speed: 0
});

let interval = null;
const onLeftStick = (data) => {
    clearTimeout(interval);
    interval = setTimeout(() => stopMoving(data), 400);

    socketEmitThrottle(MOVE_PERSON, {
        moveDirect: getAngle(data['x-axis'], data['y-axis']),
        viewDirect: getAngle(data['x-axis'], data['y-axis']),
        speed: getSpeed(data['x-axis'], data['y-axis'])
    });
};

const onRightStick = () => socketEmitThrottle(SHOT);
const onStartButton = () => console.log('start');

window.CanvasGamepad.setup({
    canvas: 'controller',
    trace: true,
    leftStick: true,
    rightStick: true,
    debug: true,
    hint: true,
    onLeftStick,
    onRightStick,
    onStartButton,
    buttons: []
});

window.multikey.setup(window.CanvasGamepad.events, 'qwasbv', true);
