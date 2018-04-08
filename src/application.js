import io from 'socket.io-client';
import config from './config';
import auth from './auth';
import log from './utils/logger';
import { USER_LOGIN, MOVE_PERSON, SHOT, HIT, DEAD, CHANGE_NAME, START_GAME, FINISH_GAME, GET_AREA, GET_SCENE } from './message-types';
const socket = io(config.host);
const APP_TYPE = 'phone';
let canvas;

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
            width: 640,
            height: 360
        });
    });

    socket.emit(START_GAME);

    socket.on(GET_SCENE, (data) => {
        if (data && data.princess) {
            if (canvas) {
                canvas.clear();
                const CROSS = 1;
                if (data.dragon) {
                    const dr = data.dragon;
                    canvas.point(dr.position.x, dr.position.y, dr.size, 'blue'); // Дракон!
                }

                for (var key in data.booms) {
                    if (data.booms[key]) {
                        const bm = data.booms[key];
                        canvas.point(bm.position.x, bm.position.y, bm.radius, 'black'); // бум!
                    }
                }

                Object.values(data.princess).forEach((princess) => {
                    const { x, y } = princess.position;
                    canvas.line(
                        x,
                        y,
                        x + CROSS * Math.sin(princess.viewDirect),
                        y + CROSS * Math.cos(princess.viewDirect),
                        'rgba(0,0,0,1)',
                        1
                    );

                    canvas.point(princess.position.x, princess.position.y, princess.size, princess.color);
                });

                canvas.line(0.6, 2.3, 0.6, 2.3, 'red', 1);

                for (var key in data.shots) {
                    if (data.shots[key]) {
                        const st = data.shots[key];
                        canvas.point(st.position.x, st.position.y, null, 'red'); // выстрел!
                    }
                }
            }
        }
    });

    socket.on(SHOT, data => log('Выстрел!', data));
    socket.on(HIT, data => log('Попадание!', data));
    socket.on(DEAD, (data) => {
        log('Ты помер!', data);
        socket.emit(FINISH_GAME);
    });
}

const radians = degrees => degrees * Math.PI / 180;
const degrees = radians => radians * 180 / Math.PI;
const getAngle = (x, y) => {

    return Math.atan2(x, y);
}

window.radians = radians;
window.degrees = degrees;

window.handle = {
    onStick: data => {
        socket.emit(MOVE_PERSON, { moveDirect: getAngle(data['x-axis'], data['y-axis']), viewDirect: radians(90) })
    }
}